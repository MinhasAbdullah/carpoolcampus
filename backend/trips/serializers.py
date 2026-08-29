from rest_framework import serializers
from .models import Trip
from matching.models import Match


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['id', 'match', 'date', 'status', 'cost_per_rider', 'driver_on_the_way', 'created_at']
        read_only_fields = ['cost_per_rider']


class RideRequestActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'decline'])