from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import DriverProfile, EmergencyContact, Report

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def validate_email(self, value):
        domain = value.split('@')[-1].lower()
        if not domain.endswith('.edu.pk'):
            raise serializers.ValidationError(
                "Please sign up with a valid university (.edu.pk) email address."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            is_verified=True,  # auto-verified since domain check already passed
        )
        return user


    

class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = ['id', 'user', 'car_model', 'plate_number', 'seats_available']
        read_only_fields = ['user']


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'user', 'name', 'phone']
        read_only_fields = ['user']


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'reported_by', 'reported_user', 'reason', 'status', 'admin_comment', 'created_at']
        read_only_fields = ['reported_by', 'status', 'admin_comment']


class UserVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_verified', 'rating_avg', 'created_at']