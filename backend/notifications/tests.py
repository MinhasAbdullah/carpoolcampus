from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from channels.testing import WebsocketCommunicator
from core.asgi import application
from datetime import time, date
from .models import Notification
from .utils import notify_user, broadcast_trip_event, async_notify_user, async_broadcast_trip_event
from routes.models import Route
from matching.models import Match
from trips.models import Trip

User = get_user_model()


class NotificationModelAndAPITestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1', email='user1@nust.edu.pk', password='password123', role='rider', is_verified=True
        )
        self.user2 = User.objects.create_user(
            username='user2', email='user2@nust.edu.pk', password='password123', role='driver', is_verified=True
        )
        self.client = APIClient()

    def test_notify_user_utility(self):
        notif = notify_user(
            recipient=self.user1,
            sender=self.user2,
            title="Test Notification",
            message="This is a test notification message",
            notification_type=Notification.NotificationType.GENERAL,
            data={'custom_key': 'custom_val'}
        )
        self.assertEqual(Notification.objects.count(), 1)
        self.assertEqual(notif.recipient, self.user1)
        self.assertEqual(notif.sender, self.user2)
        self.assertEqual(notif.is_read, False)
        self.assertEqual(notif.data['custom_key'], 'custom_val')

    def test_notification_list_and_filter(self):
        notify_user(self.user1, "Notif 1", "Msg 1")
        n2 = notify_user(self.user1, "Notif 2", "Msg 2")
        n2.is_read = True
        n2.save()

        self.client.force_authenticate(user=self.user1)
        # All
        res = self.client.get('/api/notifications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

        # Unread only
        res_unread = self.client.get('/api/notifications/?unread_only=true')
        self.assertEqual(res_unread.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_unread.data), 1)

    def test_notification_mark_read_endpoint(self):
        notif = notify_user(self.user1, "Notif", "Msg")
        self.client.force_authenticate(user=self.user1)
        res = self.client.post(f'/api/notifications/{notif.id}/read/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)

    def test_notification_mark_all_read_endpoint(self):
        notify_user(self.user1, "Notif 1", "Msg 1")
        notify_user(self.user1, "Notif 2", "Msg 2")
        self.client.force_authenticate(user=self.user1)
        res = self.client.post('/api/notifications/mark-all-read/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['marked_read_count'], 2)
        self.assertEqual(Notification.objects.filter(recipient=self.user1, is_read=False).count(), 0)


class ChannelsRealtimeWebsocketTestCase(TransactionTestCase):
    def setUp(self):
        self.driver = User.objects.create_user(
            username='wsdriver', email='wsdriver@nust.edu.pk', password='password123', role='driver', is_verified=True
        )
        self.rider = User.objects.create_user(
            username='wsrider', email='wsrider@nust.edu.pk', password='password123', role='rider', is_verified=True
        )
        self.driver_token = str(RefreshToken.for_user(self.driver).access_token)
        self.rider_token = str(RefreshToken.for_user(self.rider).access_token)

        self.driver_route = Route.objects.create(
            user=self.driver,
            role=Route.RoleType.DRIVER,
            origin_lat=33.6425,
            origin_lng=72.9904,
            dest_lat=33.7182,
            dest_lng=73.0605,
            days_of_week=['mon', 'tue'],
            departure_time=time(8, 0),
            is_active=True
        )
        self.rider_route = Route.objects.create(
            user=self.rider,
            role=Route.RoleType.RIDER,
            origin_lat=33.6425,
            origin_lng=72.9904,
            dest_lat=33.7182,
            dest_lng=73.0605,
            days_of_week=['mon', 'tue'],
            departure_time=time(8, 0),
            is_active=True
        )
        self.match = Match.objects.create(
            driver_route=self.driver_route,
            rider_route=self.rider_route,
            overlap_score=0.95,
            status=Match.Status.APPROVED
        )
        self.trip = Trip.objects.create(
            match=self.match,
            date=date.today(),
            cost_per_rider=150.00
        )

    async def test_notification_websocket_connect_and_receive(self):
        communicator = WebsocketCommunicator(
            application, f"/ws/notifications/?token={self.rider_token}"
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # First message is connection_established
        response = await communicator.receive_json_from()
        self.assertEqual(response['type'], 'connection_established')
        self.assertEqual(response['user_id'], self.rider.id)

        # Trigger async notification
        await async_notify_user(
            recipient=self.rider,
            sender=self.driver,
            title="Realtime Alert",
            message="Testing realtime notification delivery",
            notification_type=Notification.NotificationType.GENERAL
        )

        # Receive real-time notification
        notif_msg = await communicator.receive_json_from()
        self.assertEqual(notif_msg['type'], 'notification')
        self.assertEqual(notif_msg['notification']['title'], 'Realtime Alert')

        # Test heartbeat ping
        await communicator.send_json_to({'action': 'ping'})
        pong = await communicator.receive_json_from()
        self.assertEqual(pong['type'], 'pong')

        await communicator.disconnect()

    async def test_trip_websocket_on_the_way_broadcast(self):
        # Connect rider to live trip room
        communicator = WebsocketCommunicator(
            application, f"/ws/trips/{self.trip.id}/?token={self.rider_token}"
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        conn_msg = await communicator.receive_json_from()
        self.assertEqual(conn_msg['type'], 'connection_established')

        # Broadcast 'driver_on_the_way' event asynchronously
        await async_broadcast_trip_event(
            trip_id=self.trip.id,
            event_type='driver_on_the_way',
            payload={'trip_id': self.trip.id, 'driver_username': self.driver.username, 'driver_on_the_way': True}
        )

        event_msg = await communicator.receive_json_from()
        self.assertEqual(event_msg['type'], 'trip_event')
        self.assertEqual(event_msg['event'], 'driver_on_the_way')
        self.assertEqual(event_msg['payload']['driver_username'], self.driver.username)

        await communicator.disconnect()
