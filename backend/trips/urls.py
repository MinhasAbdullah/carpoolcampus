from django.urls import path
from .views import MyTripsView, RideRequestActionView, OnTheWayPingView

urlpatterns = [
    path('mine/', MyTripsView.as_view(), name='trips-mine'),
    path('request/<int:match_id>/action/', RideRequestActionView.as_view(), name='ride-request-action'),
    path('<int:trip_id>/on-the-way/', OnTheWayPingView.as_view(), name='trip-on-the-way'),
]