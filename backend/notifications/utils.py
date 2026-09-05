import asyncio
import logging
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from .models import Notification

logger = logging.getLogger(__name__)


def _send_to_channel_layer(channel_layer, group_name, event):
    """
    Safely send an event to a channel layer group whether in a synchronous
    or asynchronous execution context.
    """
    try:
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            loop.create_task(channel_layer.group_send(group_name, event))
        else:
            async_to_sync(channel_layer.group_send)(group_name, event)
    except Exception as e:
        logger.error(f"Failed to send event to channel layer group {group_name}: {e}")


def notify_user(recipient, title, message, notification_type=Notification.NotificationType.GENERAL, data=None, sender=None):
    """
    Persist a notification in the database and push it in real-time
    via Django Channels to the recipient's personal WebSocket group (`user_<id>`).
    """
    if data is None:
        data = {}

    # Persist in DB
    notification = Notification.objects.create(
        recipient=recipient,
        sender=sender,
        title=title,
        message=message,
        notification_type=notification_type,
        data=data
    )

    # Broadcast via channel layer
    channel_layer = get_channel_layer()
    if channel_layer:
        group_name = f"user_{recipient.id}"
        event = {
            'type': 'send_notification',
            'notification': {
                'id': notification.id,
                'recipient_id': recipient.id,
                'sender_id': sender.id if sender else None,
                'sender_username': sender.username if sender else None,
                'notification_type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'data': notification.data,
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
            }
        }
        _send_to_channel_layer(channel_layer, group_name, event)

    return notification


async def async_notify_user(recipient, title, message, notification_type=Notification.NotificationType.GENERAL, data=None, sender=None):
    """
    Asynchronous version of notify_user for use in async consumers or async tasks.
    """
    if data is None:
        data = {}

    notification = await sync_to_async(Notification.objects.create)(
        recipient=recipient,
        sender=sender,
        title=title,
        message=message,
        notification_type=notification_type,
        data=data
    )

    channel_layer = get_channel_layer()
    if channel_layer:
        group_name = f"user_{recipient.id}"
        event = {
            'type': 'send_notification',
            'notification': {
                'id': notification.id,
                'recipient_id': recipient.id,
                'sender_id': sender.id if sender else None,
                'sender_username': sender.username if sender else None,
                'notification_type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'data': notification.data,
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
            }
        }
        await channel_layer.group_send(group_name, event)

    return notification


def broadcast_trip_event(trip_id, event_type, payload):
    """
    Broadcast a real-time event to all listeners in a trip's room (`trip_<trip_id>`).
    Used for live 'I'm on my way' pings, driver live location, and trip status transitions.
    """
    channel_layer = get_channel_layer()
    if channel_layer:
        group_name = f"trip_{trip_id}"
        event = {
            'type': 'trip_message',
            'event': event_type,
            'payload': payload
        }
        _send_to_channel_layer(channel_layer, group_name, event)


async def async_broadcast_trip_event(trip_id, event_type, payload):
    """
    Asynchronous version of broadcast_trip_event.
    """
    channel_layer = get_channel_layer()
    if channel_layer:
        group_name = f"trip_{trip_id}"
        event = {
            'type': 'trip_message',
            'event': event_type,
            'payload': payload
        }
        await channel_layer.group_send(group_name, event)
