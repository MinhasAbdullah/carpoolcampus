from rest_framework import serializers
from .models import Route, RoutePause


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = [
            'id', 'user', 'role', 'origin_lat', 'origin_lng',
            'dest_lat', 'dest_lng', 'days_of_week', 'departure_time',
            'is_active', 'created_at',
        ]
        read_only_fields = ['user']


class RoutePauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutePause
        fields = ['id', 'route', 'date', 'reason']