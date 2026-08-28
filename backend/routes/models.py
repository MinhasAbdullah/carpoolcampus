from django.db import models
from django.conf import settings


class Route(models.Model):
    class RoleType(models.TextChoices):
        DRIVER = 'driver', 'Driver'
        RIDER = 'rider', 'Rider'

    class DayOfWeek(models.TextChoices):
        MON = 'mon', 'Monday'
        TUE = 'tue', 'Tuesday'
        WED = 'wed', 'Wednesday'
        THU = 'thu', 'Thursday'
        FRI = 'fri', 'Friday'
        SAT = 'sat', 'Saturday'
        SUN = 'sun', 'Sunday'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='routes')
    role = models.CharField(max_length=20, choices=RoleType.choices)
    origin_lat = models.FloatField()
    origin_lng = models.FloatField()
    dest_lat = models.FloatField()
    dest_lng = models.FloatField()
    days_of_week = models.JSONField(default=list)  # e.g. ["mon", "wed", "fri"]
    departure_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.role}) - {self.departure_time}"


class RoutePause(models.Model):
    """Recurring trip management — pause/skip a specific day."""
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='pauses')
    date = models.DateField()
    reason = models.CharField(max_length=200, blank=True)

    class Meta:
        unique_together = ('route', 'date')

    def __str__(self):
        return f"{self.route} paused on {self.date}"