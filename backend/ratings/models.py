from django.db import models
from django.conf import settings
from trips.models import Trip


class Rating(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='ratings')
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings_given')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings_received')
    score = models.PositiveSmallIntegerField()  # 1-5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('trip', 'from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username}: {self.score}"