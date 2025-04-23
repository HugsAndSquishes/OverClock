from django.db import models
from datetime import date
from django.db.models import Sum
from django.contrib.auth.models import User

class ClockRecord(models.Model):
    employee_name = models.CharField(max_length=100)
    clock_in_time = models.DateTimeField(null=True, blank=True)
    clock_out_time = models.DateTimeField(null=True, blank=True)
    day = models.DateField(default=date.today)

    def __str__(self):
        return f"{self.employee_name or 'User'} - {self.clock_in_time} to {self.clock_out_time}"
    
    @staticmethod
    def get_leaderboard():
        leaderboard = (
            ClockRecord.objects.values('employee_name')
            .annotate(total_hours=Sum(models.ExpressionWrapper(
                models.F('clock_out_time') - models.F('clock_in_time'),
                output_field=models.DurationField()
            )))
            .order_by('-total_hours')
        )

        results = []
        for entry in leaderboard:
            hours = entry['total_hours'].total_seconds() / 3600 if entry['total_hours'] else 0
            results.append({
                'employee_name': entry['employee_name'],
                'total_hours': round(hours, 2)
            })
        return results

class AttendanceHistory(models.Model):
    clock_record = models.ForeignKey('ClockRecord', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.clock_record)


class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name