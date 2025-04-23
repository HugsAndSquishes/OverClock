from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import attendance_history, leaderboard_view, clock_action

router=DefaultRouter()

urlpatterns = [
    path('clock/', clock_action, name='clock_action'),
    path('history/', attendance_history),
    path('leaderboard/', leaderboard_view),
]
 