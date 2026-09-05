from django.db import models
from routes.models import Route


class Match(models.Model):
    class Status(models.TextChoices):
        SUGGESTED = 'suggested', 'Suggested'
        REQUESTED = 'requested', 'Requested'
        APPROVED = 'approved', 'Approved'
        DECLINED = 'declined', 'Declined'

    driver_route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='driver_matches')
    rider_route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='rider_matches')
    overlap_score = models.FloatField()  # 0.0 - 1.0
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUGGESTED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('driver_route', 'rider_route')

    def __str__(self):
        return f"{self.driver_route} <-> {self.rider_route} ({self.overlap_score:.2f})"