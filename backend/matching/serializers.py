from rest_framework import serializers
from .models import Match
from routes.models import Route
from routes.serializers import RouteSerializer
from users.serializers import UserVerificationSerializer


class MatchSerializer(serializers.ModelSerializer):
    driver_route_details = RouteSerializer(source='driver_route', read_only=True)
    rider_route_details = RouteSerializer(source='rider_route', read_only=True)
    driver_user = UserVerificationSerializer(source='driver_route.user', read_only=True)
    rider_user = UserVerificationSerializer(source='rider_route.user', read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'driver_route', 'rider_route',
            'driver_route_details', 'rider_route_details',
            'driver_user', 'rider_user',
            'overlap_score', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class MatchCandidateSerializer(serializers.Serializer):
    candidate_route = RouteSerializer()
    candidate_user = UserVerificationSerializer(source='candidate_route.user')
    overlap_score = serializers.FloatField()
    pickup_distance_km = serializers.FloatField(allow_null=True)
    dropoff_distance_km = serializers.FloatField(allow_null=True)
    detour_distance_km = serializers.FloatField(allow_null=True)
    time_difference_minutes = serializers.IntegerField(allow_null=True)
    shared_days = serializers.ListField(child=serializers.CharField())
    is_compatible = serializers.BooleanField()
    existing_match_id = serializers.IntegerField(allow_null=True)
    existing_match_status = serializers.CharField(allow_null=True)


class RequestRideSerializer(serializers.Serializer):
    match_id = serializers.IntegerField(required=False, allow_null=True)
    driver_route_id = serializers.IntegerField(required=False, allow_null=True)
    rider_route_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        match_id = attrs.get('match_id')
        driver_route_id = attrs.get('driver_route_id')
        rider_route_id = attrs.get('rider_route_id')

        if not match_id and not (driver_route_id and rider_route_id):
            raise serializers.ValidationError(
                "Either 'match_id' or both 'driver_route_id' and 'rider_route_id' must be provided."
            )
        return attrs
