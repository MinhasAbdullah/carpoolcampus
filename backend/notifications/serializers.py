from rest_framework import serializers
from .models import Notification
from users.serializers import UserVerificationSerializer


class NotificationSerializer(serializers.ModelSerializer):
    sender_details = UserVerificationSerializer(source='sender', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'sender', 'sender_details',
            'notification_type', 'title', 'message', 'data',
            'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'recipient', 'sender', 'created_at']
