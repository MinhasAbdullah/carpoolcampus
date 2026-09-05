from rest_framework import generics, permissions
from .models import DriverProfile, EmergencyContact, Report
from .serializers import SignupSerializer, DriverProfileSerializer, EmergencyContactSerializer, ReportSerializer, UserVerificationSerializer
from .permissions import IsDriver,  IsAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]


class DriverProfileCreateView(generics.CreateAPIView):
    serializer_class = DriverProfileSerializer
    permission_classes = [IsDriver]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DriverProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = DriverProfileSerializer
    permission_classes = [IsDriver]

    def get_queryset(self):
        return DriverProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return self.get_queryset().get()


class EmergencyContactCreateView(generics.CreateAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EmergencyContactListView(generics.ListAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

class ReportCreateView(generics.CreateAPIView):
    """Any authenticated user can file a report"""
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)


class ReportQueueView(generics.ListAPIView):
    """Admin: list pending reports"""
    serializer_class = ReportSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return Report.objects.filter(status=Report.Status.PENDING)


class ReportActionView(APIView):
    """Admin: mark a report as reviewed/dismissed with a comment"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            report = Report.objects.get(pk=pk)
        except Report.DoesNotExist:
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')  # 'reviewed' or 'dismissed'
        comment = request.data.get('comment', '')

        if new_status not in ['reviewed', 'dismissed']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        report.status = new_status
        report.admin_comment = comment
        report.save()
        return Response(ReportSerializer(report).data, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    """Admin: list all users for verification overview"""
    serializer_class = UserVerificationSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()


class ToggleUserVerificationView(APIView):
    """Admin: manually flag/unflag a user's verification status"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user.is_verified = request.data.get('is_verified', user.is_verified)
        user.save()
        return Response(UserVerificationSerializer(user).data, status=status.HTTP_200_OK)