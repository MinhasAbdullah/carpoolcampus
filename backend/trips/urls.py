from django.urls import path
from .views import MyTripsView, RideRequestActionView, OnTheWayPingView, UpdateTripStatusView

urlpatterns = [
    path('mine/', MyTripsView.as_view(), name='trips-mine'),
    path('request/<int:match_id>/action/', RideRequestActionView.as_view(), name='ride-request-action'),
    path('<int:trip_id>/on-the-way/', OnTheWayPingView.as_view(), name='trip-on-the-way'),
    path('<int:trip_id>/status/', UpdateTripStatusView.as_view(), name='trip-status-update'),
]