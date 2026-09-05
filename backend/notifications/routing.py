from django.urls import re_path
from .consumers import NotificationConsumer, TripConsumer

websocket_urlpatterns = [
    re_path(r'^ws/notifications/?$', NotificationConsumer.as_asgi()),
    re_path(r'^ws/trips/(?P<trip_id>\d+)/?$', TripConsumer.as_asgi()),
]
