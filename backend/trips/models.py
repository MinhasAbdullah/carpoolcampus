from django.db import models
from matching.models import Match


class Trip(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='trips')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    cost_per_rider = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    driver_on_the_way = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id} - {self.date} ({self.status})"