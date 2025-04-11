from django.test import TestCase
from django.db import IntegrityError
from .models import Leaderboard, Player

# Create your tests here.

class LeaderboardTests(TestCase):
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            name="Test Leaderboard",
            description="Test Description"
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.name, "Test Leaderboard")
        self.assertEqual(self.leaderboard.description, "Test Description")
        self.assertEqual(str(self.leaderboard), "Test Leaderboard")

class PlayerTests(TestCase):
    def setUp(self):
        self.player = Player.objects.create(
            username="testuser",
            email="test@example.com"
        )

    def test_player_creation(self):
        self.assertEqual(self.player.username, "testuser")
        self.assertEqual(self.player.email, "test@example.com")
        self.assertEqual(str(self.player), "testuser")

    def test_unique_username(self):
        with self.assertRaises(IntegrityError):
            Player.objects.create(
                username="testuser",  # Same username as setUp
                email="another@example.com"
            )

    def test_unique_email(self):
        with self.assertRaises(IntegrityError):
            Player.objects.create(
                username="anotheruser",
                email="test@example.com"  # Same email as setUp
            )
