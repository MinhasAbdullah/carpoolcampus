"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('api/routes/', include('routes.urls')),
    path('api/matching/', include('matching.urls')),
    path('api/trips/', include('trips.urls')),
    path('api/ratings/', include('ratings.urls')),
    path('api/notifications/', include('notifications.urls')),
]
