from rest_framework import generics, permissions
from .models import Route, RoutePause
from .serializers import RouteSerializer, RoutePauseSerializer


class RouteCreateView(generics.CreateAPIView):
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RouteListMineView(generics.ListAPIView):
    """List the logged-in user's own routes"""
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Route.objects.filter(user=self.request.user)


class RouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Route.objects.filter(user=self.request.user)


class RoutePauseCreateView(generics.CreateAPIView):
    """Pause/skip a specific day on a recurring route"""
    serializer_class = RoutePauseSerializer
    permission_classes = [permissions.IsAuthenticated]