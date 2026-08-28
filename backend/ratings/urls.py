from django.urls import path
from .views import RatingCreateView, RatingsReceivedView

urlpatterns = [
    path('', RatingCreateView.as_view(), name='rating-create'),
    path('user/<int:user_id>/', RatingsReceivedView.as_view(), name='ratings-received'),
]