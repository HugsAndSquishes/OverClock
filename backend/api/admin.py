from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Department, Leaderboard, Attendance

# Register your models here.
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        'get_employee_id',
        'get_first_name',
        'get_last_name',
        'get_department',
        'punch_type',
        'get_date',
        'get_time',
    )
    list_filter = ('user__first_name', 'user__last_name', 'user__department__name')
    search_fields = ('user__first_name', 'user__last_name', 'user__employee_id')

    # Custom field for employee ID
    def get_employee_id(self, obj):
        return obj.user.employee_id
    get_employee_id.short_description = 'Employee ID'

    def get_first_name(self, obj):
        return obj.user.first_name
    get_first_name.short_description = 'First Name'

    def get_last_name(self, obj):
        return obj.user.last_name
    get_last_name.short_description = 'Last Name'

    def get_department(self, obj):
        return obj.user.department.name if obj.user.department else '-'
    get_department.short_description = 'Department'

    def punch_type(self, obj):
        return "In" if obj.clock_in and not obj.clock_out else "Out" if obj.clock_in and obj.clock_out else "-"
    punch_type.short_description = 'Punch Type'

    def get_date(self, obj):
        return obj.clock_in.date() if obj.clock_in else "-"
    get_date.short_description = 'Date'

    def get_time(self, obj):
        return obj.clock_in.strftime('%I:%M %p') if obj.clock_in else "-"
    get_time.short_description = 'Time'

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'manager')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    pass



@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Show department in list view (optional)
    list_display = ('username', 'email', 'first_name', 'last_name', 'employee_id', 'department')
    list_filter = ('department',)

    # Add department to the user form
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Company Info', {
            'fields': ('employee_id', 'sub_rank', 'department')
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Company Info', {
            'fields': ('employee_id', 'sub_rank', 'department')
        }),
    )
