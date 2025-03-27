from django.contrib import admin
from .models import (
    User,
    Attendance,
    Leaderboard,
    Payroll,
    AttendanceAdjustment
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'role', 'sub_rank', 'employee_id',)
    search_fields = ('username', 'employee_id',)
    list_filter = ('role',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'clock_in', 'clock_out', 'total_hours')
    list_filter = ('user__role',)
    search_fields = ('user__username',)

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_hours', 'rank')
    search_fields = ('user__username',)
    list_filter = ('rank',)

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'pay_period_start', 'pay_period_end', 'total_hours_worked', 'salary_paid')
    list_filter = ('pay_period_start', 'pay_period_end')
    search_fields = ('user__username',)

@admin.register(AttendanceAdjustment)
class AttendanceAdjustmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'attendance', 'adjusted_by', 'adjusted_at')
    search_fields = ('attendance__user__username', 'adjusted_by__username',)
