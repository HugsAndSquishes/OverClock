from rest_framework import serializers
from .models import ClockRecord, AttendanceHistory

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
