from django.urls import path
from .views import (
    SignupView, DriverProfileCreateView, DriverProfileDetailView,
    EmergencyContactCreateView, EmergencyContactListView,
    ReportCreateView, ReportQueueView, ReportActionView,
    UserListView, ToggleUserVerificationView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('driver-profile/', DriverProfileCreateView.as_view(), name='driver-profile-create'),
    path('driver-profile/me/', DriverProfileDetailView.as_view(), name='driver-profile-detail'),
    path('emergency-contact/', EmergencyContactCreateView.as_view(), name='emergency-contact-create'),
    path('emergency-contact/list/', EmergencyContactListView.as_view(), name='emergency-contact-list'),
    path('reports/', ReportCreateView.as_view(), name='report-create'),
    path('admin/reports/queue/', ReportQueueView.as_view(), name='report-queue'),
    path('admin/reports/<int:pk>/action/', ReportActionView.as_view(), name='report-action'),
    path('admin/users/', UserListView.as_view(), name='user-list'),
    path('admin/users/<int:pk>/verify/', ToggleUserVerificationView.as_view(), name='user-verify'),
]