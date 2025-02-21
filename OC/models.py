from django.db import models

# Create your models here.
class Leaderboard(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Player(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Score(models.Model):
    leaderboard = models.ForeignKey(Leaderboard, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    score = models.IntegerField()
    date_achieved = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', 'date_achieved']  # Order by highest score first

    def __str__(self):
        return f"{self.player.username} - {self.score}"
