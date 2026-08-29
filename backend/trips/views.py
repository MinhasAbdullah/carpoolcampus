from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Trip
from .serializers import TripSerializer, RideRequestActionSerializer
from .utils import calculate_cost_per_rider
from matching.models import Match


class MyTripsView(generics.ListAPIView):
    """List trips where the logged-in user is driver or rider"""
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trip.objects.filter(
            match__driver_route__user=user
        ) | Trip.objects.filter(
            match__rider_route__user=user
        )


class RideRequestActionView(APIView):
    """Driver approves/declines a ride request (a Match in 'requested' status)"""
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        try:
            match = Match.objects.get(id=match_id, driver_route__user=request.user)
        except Match.DoesNotExist:
            return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RideRequestActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data['action']

        if action == 'approve':
            match.status = Match.Status.APPROVED
            match.save()

            # Count current approved riders for this driver route to calculate cost split
            num_riders = Match.objects.filter(
                driver_route=match.driver_route, status=Match.Status.APPROVED
            ).count()
            cost = calculate_cost_per_rider(match.driver_route, num_riders)

            trip = Trip.objects.create(
                match=match,
                date=request.data.get('date'),  # first trip date, e.g. next occurrence
                cost_per_rider=cost,
            )
            return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)

        else:  # decline
            match.status = Match.Status.DECLINED
            match.save()
            return Response({'status': 'declined'}, status=status.HTTP_200_OK)


class OnTheWayPingView(APIView):
    """Driver sends 'I'm on my way' status for today's trip"""
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id, match__driver_route__user=request.user)
        except Trip.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)

        trip.driver_on_the_way = True
        trip.save()
        # Wajih's real-time notification trigger would fire here
        return Response({'status': 'ping sent'}, status=status.HTTP_200_OK)