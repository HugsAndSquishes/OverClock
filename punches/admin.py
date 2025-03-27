from django.contrib import admin
from . import models

# Register your models here.
class AttendanceAdmin(admin.ModelAdmin):
    pass

admin.site.register(models.Attendance, AttendanceAdmin) 