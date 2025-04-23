from rest_framework import serializers
from .models import ClockRecord, AttendanceHistory, Team
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class ClockRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClockRecord
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceHistory
        fields = '__all__'


class LeaderboardSerializer(serializers.Serializer):
    employee_name = serializers.CharField()
    total_hours = serializers.FloatField()


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    is_manager = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['username', 'is_manager']
    
    def get_is_manager(self, obj):
        return obj.groups.filter(name='Managers').exists()