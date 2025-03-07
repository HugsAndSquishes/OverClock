# overclockapp/serializers.py
from rest_framework import serializers
from .models import (
    User,
    Attendance,
    Leaderboard,
    Payroll,
    AttendanceAdjustment
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'employee_id', 'email', 'sub_rank']

class AttendanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'clock_in', 'clock_out', 'total_hours']

class LeaderboardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'total_hours', 'rank']

class PayrollSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Payroll
        fields = ['id', 'user', 'pay_period_start', 'pay_period_end', 'total_hours_worked', 'salary_paid']

class AttendanceAdjustmentSerializer(serializers.ModelSerializer):
    attendance = AttendanceSerializer(read_only=True)
    adjusted_by = UserSerializer(read_only=True)

    class Meta:
        model = AttendanceAdjustment
        fields = [
            'id', 'attendance', 'adjusted_by',
            'old_clock_in', 'old_clock_out',
            'new_clock_in', 'new_clock_out',
            'adjustment_reason', 'adjusted_at'
        ]
