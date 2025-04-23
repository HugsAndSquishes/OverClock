from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ClockRecord, Team
from datetime import timedelta, datetime
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate demo data for the OverClock app'

    def handle(self, *args, **kwargs):
        # Create demo users if they don't exist
        demo_users = [
            {'username': 'alice', 'password': 'password123'},
            {'username': 'bob', 'password': 'password123'},
            {'username': 'carol', 'password': 'password123'},
            {'username': 'dave', 'password': 'password123'},
        ]
        for user_data in demo_users:
            user, created = User.objects.get_or_create(username=user_data['username'])
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user {user.username}"))

        users = list(User.objects.filter(username__in=[u['username'] for u in demo_users]))
        # Create demo ClockRecords for the past 10 days
        for day_offset in range(1, 81):
            day = timezone.now().date() - timedelta(days=day_offset)
            for user in users:
                clock_in = datetime.combine(day, datetime.min.time()).replace(hour=9)
                clock_out = datetime.combine(day, datetime.min.time()).replace(hour=17)
                ClockRecord.objects.create(
                    employee_name=user.username,
                    clock_in_time=timezone.make_aware(clock_in),
                    clock_out_time=timezone.make_aware(clock_out),
                    day=day
                )
        # Create a demo team and assign all users
        team, created = Team.objects.get_or_create(name="Demo Team")
        team.members.set(users)
        team.save()
        self.stdout.write(self.style.SUCCESS("Demo data populated successfully."))