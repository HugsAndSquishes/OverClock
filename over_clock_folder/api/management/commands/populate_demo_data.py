from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from api.models import ClockRecord, Team
from datetime import timedelta, datetime
import random
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
        
        # Create and assign groups
        managers_group, _ = Group.objects.get_or_create(name='Managers')
        employees_group, _ = Group.objects.get_or_create(name='Employees')
        
        # Add alice to Managers
        alice = User.objects.get(username='alice')
        managers_group.user_set.add(alice)
        self.stdout.write(self.style.SUCCESS(f"Added {alice.username} to Managers group"))
        
        # Add bob, carol, dave to Employees
        employee_users = User.objects.filter(username__in=['bob', 'carol', 'dave'])
        for user in employee_users:
            employees_group.user_set.add(user)
            self.stdout.write(self.style.SUCCESS(f"Added {user.username} to Employees group"))
        
        # Add jonathanermias to Managers if exists
        try:
            jonathan = User.objects.get(username='jonathanermias')
            managers_group.user_set.add(jonathan)
            self.stdout.write(self.style.SUCCESS(f"Added jonathanermias to Managers group"))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING("User 'jonathanermias' not found, skipping group assignment"))
        
        # Define user work patterns
        work_patterns = {
            'alice': {  # Manager - generally works longer hours
                'avg_start_hour': 8,  # Usually starts around 8 AM
                'avg_end_hour': 18,   # Usually ends around 6 PM
                'start_variance': 1,   # Can vary start by ±1 hour
                'end_variance': 2,     # Can vary end by ±2 hours
                'work_ethic': 0.9,     # 90% chance of working any given day
                'weekend_ethic': 0.4,  # 40% chance of working on weekends
            },
            'bob': {    # Senior employee - consistent worker
                'avg_start_hour': 9,
                'avg_end_hour': 17,
                'start_variance': 0.5,  # Very consistent start time
                'end_variance': 1,
                'work_ethic': 0.95,     # Very reliable
                'weekend_ethic': 0.1,   # Rarely works weekends
            },
            'carol': {  # Mid-level employee - comes in early, leaves early
                'avg_start_hour': 7,
                'avg_end_hour': 15,
                'start_variance': 0.7,
                'end_variance': 1.2,
                'work_ethic': 0.85,
                'weekend_ethic': 0.2,
            },
            'dave': {   # Junior employee - less consistent
                'avg_start_hour': 9.5,   # Tends to come in a bit late
                'avg_end_hour': 17.5,
                'start_variance': 1.5,    # Highly variable start time
                'end_variance': 1.5,
                'work_ethic': 0.8,        # Sometimes misses work
                'weekend_ethic': 0.05,    # Almost never works weekends
            },
        }
        
        # Delete existing clock records to avoid duplication
        ClockRecord.objects.all().delete()
        
        # Create demo ClockRecords for the past 80 days
        for day_offset in range(1, 81):
            day = timezone.now().date() - timedelta(days=day_offset)
            is_weekend = day.weekday() >= 5  # 5=Saturday, 6=Sunday
            
            for user in users:
                username = user.username
                if username not in work_patterns:
                    continue  # Skip if no pattern defined
                
                pattern = work_patterns[username]
                
                # Determine if user works today
                works_today = random.random() < (pattern['weekend_ethic'] if is_weekend else pattern['work_ethic'])
                
                if not works_today:
                    continue  # Skip this day for this user
                
                # Calculate random variations
                start_hour = pattern['avg_start_hour'] + random.uniform(-pattern['start_variance'], pattern['start_variance'])
                end_hour = pattern['avg_end_hour'] + random.uniform(-pattern['end_variance'], pattern['end_variance'])
                
                # Ensure end time is after start time and at least 1 hour worked
                if end_hour - start_hour < 1:
                    end_hour = start_hour + 1 + random.uniform(0, 2)  # Add 1-3 hours
                
                # Convert hours to full datetime objects
                start_hour_int = int(start_hour)
                start_minute = int((start_hour - start_hour_int) * 60)
                end_hour_int = int(end_hour)
                end_minute = int((end_hour - end_hour_int) * 60)
                
                clock_in = datetime.combine(day, datetime.min.time()).replace(hour=start_hour_int, minute=start_minute)
                clock_out = datetime.combine(day, datetime.min.time()).replace(hour=end_hour_int, minute=end_minute)
                
                # Create record
                ClockRecord.objects.create(
                    employee_name=username,
                    clock_in_time=timezone.make_aware(clock_in),
                    clock_out_time=timezone.make_aware(clock_out),
                    day=day
                )
                
                # Occasionally add a lunch break (create two records for the day)
                if random.random() < 0.3 and (end_hour - start_hour) > 5:  # 30% chance if working >5 hours
                    # Split the day at a random point
                    lunch_start = start_hour + (end_hour - start_hour) * random.uniform(0.3, 0.7)  # Lunch in middle-ish
                    lunch_duration = random.uniform(0.5, 1.5)  # 30-90 minute lunch
                    
                    # Update the first record to end at lunch
                    lunch_start_hour_int = int(lunch_start)
                    lunch_start_minute = int((lunch_start - lunch_start_hour_int) * 60)
                    lunch_begin = datetime.combine(day, datetime.min.time()).replace(hour=lunch_start_hour_int, minute=lunch_start_minute)
                    
                    # Delete the original record
                    ClockRecord.objects.filter(
                        employee_name=username,
                        day=day
                    ).delete()
                    
                    # Create the pre-lunch record
                    ClockRecord.objects.create(
                        employee_name=username,
                        clock_in_time=timezone.make_aware(clock_in),
                        clock_out_time=timezone.make_aware(lunch_begin),
                        day=day
                    )
                    
                    # Create the post-lunch record
                    lunch_end = lunch_start + lunch_duration
                    lunch_end_hour_int = int(lunch_end)
                    lunch_end_minute = int((lunch_end - lunch_end_hour_int) * 60)
                    lunch_return = datetime.combine(day, datetime.min.time()).replace(hour=lunch_end_hour_int, minute=lunch_end_minute)
                    
                    ClockRecord.objects.create(
                        employee_name=username,
                        clock_in_time=timezone.make_aware(lunch_return),
                        clock_out_time=timezone.make_aware(clock_out),
                        day=day
                    )

        # Create a demo team and assign all users
        team, created = Team.objects.get_or_create(name="Demo Team")
        team.members.set(users)
        team.save()
        self.stdout.write(self.style.SUCCESS("Demo data populated successfully with realistic work patterns."))