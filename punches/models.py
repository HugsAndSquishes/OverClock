from django.db import models

from django.contrib.auth.models import User

# Create your models here.
class Attendance(models.Model):
    clock_type = models.TextField()
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    timestamp = models.DateTimeField(auto_now_add=True)
    # on_delete=models.CASCADE means that if the user gets deleted, all
    # punch times associated with them also gets deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    date = models.DateField()
    clock_in_time = models.TimeField(null=True, blank=True)
    clock_out_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"