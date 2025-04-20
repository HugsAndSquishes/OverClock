from django.db import models

from django.contrib.auth.models import User

class Payroll(models.Model):
    pay_start = models.DateField()
    pay_end = models.DateField()
    total_hours = models.DecimalField(decimal_places=2, max_digits=6)
    calc_pay = models.DecimalField(decimal_places=2, max_digits=10)
    # on_delete=models.CASCADE means that if the user gets deleted, all
    # punch times associated with them also gets deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payroll")