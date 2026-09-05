from django.urls import path
from .views import FindMatchesView, GenerateMatchesView, RequestRideView, MyMatchesView

urlpatterns = [
    path('find/', FindMatchesView.as_view(), name='matching-find'),
    path('generate/', GenerateMatchesView.as_view(), name='matching-generate'),
    path('request/', RequestRideView.as_view(), name='matching-request'),
    path('mine/', MyMatchesView.as_view(), name='matching-mine'),
]
