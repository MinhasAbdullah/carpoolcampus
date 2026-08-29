from django.urls import path
from .views import RouteCreateView, RouteListMineView, RouteDetailView, RoutePauseCreateView

urlpatterns = [
    path('', RouteCreateView.as_view(), name='route-create'),
    path('mine/', RouteListMineView.as_view(), name='route-list-mine'),
    path('<int:pk>/', RouteDetailView.as_view(), name='route-detail'),
    path('pause/', RoutePauseCreateView.as_view(), name='route-pause'),
]