from django.contrib import admin
from . import models

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# Register your models here.
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('get_employee_name', 'date')

    @admin.display(description='Author Name', ordering='author__name')
    def get_employee_name(self, obj):
        return obj.user.last_name + ", " + obj.user.first_name


class AttendanceInline(admin.StackedInline):
    model = models.Attendance
    can_delete = False
    verbose_name_plural = "Attendances"

class UserAdmin(BaseUserAdmin):
    list_display = ('last_name', 'first_name',)
    inlines = [AttendanceInline]


admin.site.register(models.Attendance, AttendanceAdmin) 
admin.site.unregister(User)
admin.site.register(User, UserAdmin)