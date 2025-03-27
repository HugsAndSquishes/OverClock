from django.db import models

from django.contrib.auth.models import User
from django.utils import timezone

clock_type_choices =[
    ("IN", "Clock In"),
    ("OUT", "Clock Out")
]

# Create your models here.
class Attendance(models.Model):
    clock_type = models.TextField(choices=clock_type_choices)
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    create = models.DateTimeField(auto_now_add=True)
    # on_delete=models.CASCADE means that if the user gets deleted, all
    # punch times associated with them also gets deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance")

    # removed date field because it was causing an error
    date = models.DateField(default=timezone.now)
    clock_in_time = models.TimeField(null=True, blank=True)
    clock_out_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"