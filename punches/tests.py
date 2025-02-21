

from django.test import TestCase
from .models import Punch

class PunchModelTest(TestCase):
    def test_punch_creation(self):
        punch = Punch.objects.create(user="John Doe", punch_type="IN")
        self.assertEqual(punch.punch_type, "IN")
