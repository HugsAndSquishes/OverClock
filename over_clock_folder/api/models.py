from django.db import models
from datetime import date
from django.db.models import Sum


class ClockRecord(models.Model):
    employee_name = models.CharField(max_length=100)  # optional if you want to track names
    clock_in_time = models.DateTimeField(null=True, blank=True)
    clock_out_time = models.DateTimeField(null=True, blank=True)
    day = models.DateField(default=date.today)  # Automatically set the date when the record is created

    def __str__(self):  # Changed from def str(self):
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
    # A foreign key to the ClockRecord model. This will allow you to access all the fields from ClockRecord.
    clock_record = models.ForeignKey('ClockRecord', on_delete=models.CASCADE)

    def __str__(self):
        # Using the __str__ method of ClockRecord to display the record details.
        return str(self.clock_record)
