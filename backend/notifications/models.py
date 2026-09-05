from django.db import models
from django.conf import settings


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        ON_THE_WAY = 'on_the_way', "I'm on my way"
        RIDE_REQUEST = 'ride_request', 'Ride Request'
        RIDE_APPROVED = 'ride_approved', 'Ride Approved'
        RIDE_DECLINED = 'ride_declined', 'Ride Declined'
        TRIP_STATUS = 'trip_status', 'Trip Status Update'
        GENERAL = 'general', 'General'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.GENERAL
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification({self.recipient.username} - {self.notification_type} - {self.title})"
