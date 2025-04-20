from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    manager = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_department'
    )
    
    def __str__(self):
        return self.name

# User model
class User(AbstractUser):
    '''
    ROLE_CHOICES = [
        ('employee', 'Employee'),
        ('manager', 'Manager'),
        ('admin', 'Administrator'),
    ]
    '''
    # Creates a seperate employee ID
    employee_id = models.CharField(max_length=20, unique=True, null=True, blank=True)

    # role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='employee')
    sub_rank = models.CharField(max_length=100, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    '''
    def save(self, *args, **kwargs):
        # Sync groups and role firled
        if self.groups.filter(name='Administrator').exists():
            self.role = 'admin'
        elif self.groups.filter(name='Manager').exists():
            self.role = 'manager'
        else:
            self.role = 'employee'  # Default role is 'employee'

        super().save(*args, **kwargs)
    '''

    def __str__(self):
        return self.username

# Attendance Model (Clock In/Clock Out)
class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    clock_in = models.DateTimeField(null=True, blank=True)
    clock_out = models.DateTimeField(null=True, blank=True)
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"Attendance ID: {self.id} - {self.user.username}"

# 3. Leaderboard Model
class Leaderboard(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    rank = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Leaderboard Entry"

# Payroll Model
class Payroll(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pay_period_start = models.DateField()
    pay_period_end = models.DateField()
    total_hours_worked = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    salary_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return (f"Payroll for {self.user.username} "
                f"({self.pay_period_start} to {self.pay_period_end})")

# Attendance Adjustments
class AttendanceAdjustment(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE)
    adjusted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adjustments')
    old_clock_in = models.DateTimeField(null=True, blank=True)
    old_clock_out = models.DateTimeField(null=True, blank=True)
    new_clock_in = models.DateTimeField(null=True, blank=True)
    new_clock_out = models.DateTimeField(null=True, blank=True)
    adjustment_reason = models.TextField()
    adjusted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Adjustment #{self.id} for Attendance #{self.attendance.id}"
    
