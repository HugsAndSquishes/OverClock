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
    timestamp = models.DateTimeField(auto_now_add=True)
    # on_delete=models.CASCADE means that if the user gets deleted, all
    # punch times associated with them also gets deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance")

    # removed date field because it was causing an error
    date = models.DateField(default=timezone.now)
    clock_in_time = models.TimeField(null=True, blank=True)
    clock_out_time = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"
    


class LeaderboardManager(models.Manager):
    def get_or_create_player(self, user):
        player, created = self.get_or_create(user=user)
        return player
    
class Leaderboard(models.Model):
    title = models.CharField(max_length=16)
    rank = models.IntegerField(default=-1)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_hours = models.FloatField
    task_complete = models.IntegerField

    objects = LeaderboardManager()

    class Meta:
        ordering = ['-rank']
    