from django.db import models

class ClockRecord(models.Model):
    employee_name = models.CharField(max_length=100)  # optional if you want to track names
    clock_in_time = models.DateTimeField(null=True, blank=True)
    clock_out_time = models.DateTimeField(null=True, blank=True)
    total_hours = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.employee_name or 'User'} - {self.clock_in_time} to {self.clock_out_time}"