import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Notification
from trips.models import Trip

User = get_user_model()


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for personal real-time notifications.
    Clients connect to `ws/notifications/?token=<jwt_token>`.
    """

    async def connect(self):
        self.user = self.scope.get('user')
        if not self.user or not self.user.is_authenticated:
            await self.close(code=4003)
            return

        self.group_name = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send connection confirmation
        await self.send_json({
            'type': 'connection_established',
            'message': f"Connected to notifications stream for user {self.user.username}",
            'user_id': self.user.id
        })

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content):
        """
        Handle messages sent by the client.
        Supported actions:
          - 'mark_read': mark a notification as read
          - 'ping': heartbeat check
        """
        action = content.get('action')
        if action == 'mark_read':
            notification_id = content.get('notification_id')
            if notification_id:
                success = await self._mark_notification_read(notification_id)
                await self.send_json({
                    'type': 'notification_read_ack',
                    'notification_id': notification_id,
                    'success': success
                })
        elif action == 'ping':
            await self.send_json({'type': 'pong'})

    async def send_notification(self, event):
        """
        Handler invoked when channel layer receives a notification for this user group.
        """
        await self.send_json({
            'type': 'notification',
            'notification': event['notification']
        })

    @database_sync_to_async
    def _mark_notification_read(self, notification_id):
        try:
            notif = Notification.objects.get(id=notification_id, recipient=self.user)
            notif.is_read = True
            notif.save()
            return True
        except Notification.DoesNotExist:
            return False


class TripConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for live trip rooms.
    Clients connect to `ws/trips/<trip_id>/?token=<jwt_token>`.
    Allows real-time broadcast of driver "I'm on my way" pings,
    location coordinates, and trip status transitions to riders & driver.
    """

    async def connect(self):
        self.user = self.scope.get('user')
        if not self.user or not self.user.is_authenticated:
            await self.close(code=4003)
            return

        self.trip_id = self.scope['url_route']['kwargs'].get('trip_id')
        # Check permissions: user must be part of this trip
        is_participant = await self._is_trip_participant(self.trip_id, self.user)
        if not is_participant:
            await self.close(code=4003)
            return

        self.group_name = f"trip_{self.trip_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        await self.send_json({
            'type': 'connection_established',
            'message': f"Joined live room for Trip {self.trip_id}",
            'trip_id': self.trip_id
        })

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content):
        """
        Handle incoming messages from client (e.g. driver location update or ping).
        """
        action = content.get('action')
        if action == 'location_update':
            # Driver can broadcast their live coordinates
            lat = content.get('lat')
            lng = content.get('lng')
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'trip_message',
                    'event': 'driver_location',
                    'payload': {
                        'trip_id': self.trip_id,
                        'driver_id': self.user.id,
                        'lat': lat,
                        'lng': lng
                    }
                }
            )
        elif action == 'ping':
            await self.send_json({'type': 'pong'})

    async def trip_message(self, event):
        """
        Handler invoked when an event is broadcast to the trip room.
        """
        await self.send_json({
            'type': 'trip_event',
            'event': event.get('event'),
            'payload': event.get('payload')
        })

    @database_sync_to_async
    def _is_trip_participant(self, trip_id, user):
        try:
            trip = Trip.objects.select_related(
                'match__driver_route__user', 'match__rider_route__user'
            ).get(id=trip_id)
            return (
                trip.match.driver_route.user_id == user.id or
                trip.match.rider_route.user_id == user.id or
                user.role == 'admin'
            )
        except Trip.DoesNotExist:
            return False
