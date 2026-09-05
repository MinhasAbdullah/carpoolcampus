from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from routes.models import Route
from .models import Match
from .serializers import MatchSerializer, MatchCandidateSerializer, RequestRideSerializer
from .utils import compute_route_overlap


class FindMatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        route_id = request.query_params.get('route_id')
        if not route_id:
            return Response({'error': 'route_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            source_route = Route.objects.get(id=route_id, user=request.user)
        except Route.DoesNotExist:
            return Response({'error': 'Route not found'}, status=status.HTTP_404_NOT_FOUND)

        candidate_role = Route.RoleType.RIDER if source_route.role == Route.RoleType.DRIVER else Route.RoleType.DRIVER
        candidate_routes = Route.objects.filter(role=candidate_role, is_active=True).exclude(user=request.user)

        candidates = []
        for candidate_route in candidate_routes:
            if source_route.role == Route.RoleType.DRIVER:
                driver_route, rider_route = source_route, candidate_route
            else:
                driver_route, rider_route = candidate_route, source_route

            metrics = compute_route_overlap(driver_route, rider_route)
            existing_match = Match.objects.filter(
                driver_route=driver_route,
                rider_route=rider_route,
            ).first()

            candidates.append({
                'candidate_route': candidate_route,
                **metrics,
                'existing_match_id': existing_match.id if existing_match else None,
                'existing_match_status': existing_match.status if existing_match else None,
            })

        candidates.sort(key=lambda item: item.get('overlap_score', 0), reverse=True)
        return Response(MatchCandidateSerializer(candidates, many=True).data, status=status.HTTP_200_OK)


class GenerateMatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        route_id = request.data.get('route_id')
        if not route_id:
            return Response({'error': 'route_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            source_route = Route.objects.get(id=route_id, user=request.user)
        except Route.DoesNotExist:
            return Response({'error': 'Route not found'}, status=status.HTTP_404_NOT_FOUND)

        candidate_role = Route.RoleType.RIDER if source_route.role == Route.RoleType.DRIVER else Route.RoleType.DRIVER
        candidate_routes = Route.objects.filter(role=candidate_role, is_active=True).exclude(user=request.user)
        generated = []

        for candidate_route in candidate_routes:
            if source_route.role == Route.RoleType.DRIVER:
                driver_route, rider_route = source_route, candidate_route
            else:
                driver_route, rider_route = candidate_route, source_route

            metrics = compute_route_overlap(driver_route, rider_route)
            if not metrics.get('is_compatible'):
                continue

            match, created = Match.objects.get_or_create(
                driver_route=driver_route,
                rider_route=rider_route,
                defaults={'overlap_score': metrics['overlap_score']},
            )
            if not created:
                match.overlap_score = metrics['overlap_score']
                match.save()
            generated.append(match)

        return Response(MatchSerializer(generated, many=True).data, status=status.HTTP_200_OK)


class RequestRideView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RequestRideSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        match_id = data.get('match_id')
        if match_id:
            try:
                match = Match.objects.get(id=match_id)
            except Match.DoesNotExist:
                return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                driver_route = Route.objects.get(id=data['driver_route_id'])
                rider_route = Route.objects.get(id=data['rider_route_id'])
            except Route.DoesNotExist:
                return Response({'error': 'Route not found'}, status=status.HTTP_404_NOT_FOUND)

            if request.user.id not in [driver_route.user_id, rider_route.user_id]:
                return Response({'error': 'You must own one of the routes'}, status=status.HTTP_403_FORBIDDEN)

            metrics = compute_route_overlap(driver_route, rider_route)
            match, created = Match.objects.get_or_create(
                driver_route=driver_route,
                rider_route=rider_route,
                defaults={'overlap_score': metrics['overlap_score']},
            )
            if not created:
                match.overlap_score = metrics['overlap_score']

        match.status = Match.Status.REQUESTED
        match.save()
        return Response(MatchSerializer(match).data, status=status.HTTP_200_OK)


class MyMatchesView(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter(
            Q(driver_route__user=user) | Q(rider_route__user=user)
        ).distinct().order_by('-created_at')
