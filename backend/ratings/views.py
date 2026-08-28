from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .models import Rating
from .serializers import RatingSerializer

User = get_user_model()


class RatingCreateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        rating = serializer.save(from_user=self.request.user)
        self.update_user_average(rating.to_user)

    def update_user_average(self, user):
        """Recalculate and store the user's average rating."""
        ratings = Rating.objects.filter(to_user=user)
        if ratings.exists():
            avg = sum(r.score for r in ratings) / ratings.count()
            user.rating_avg = round(avg, 2)
            user.save()


class RatingsReceivedView(generics.ListAPIView):
    """List ratings someone has received (e.g., view a driver's ratings before requesting)"""
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Rating.objects.filter(to_user_id=user_id)