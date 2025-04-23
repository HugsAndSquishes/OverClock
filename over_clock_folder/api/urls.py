from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    attendance_history, leaderboard_view, clock_action, 
    CustomTokenObtainPairView, CustomTokenRefreshView, 
    logout, is_logged_in, team_view, clock_status,
    employee_clock_records, update_clock_record)


router=DefaultRouter()

urlpatterns = [
    path('clock/', clock_action, name='clock_action'),
    path('history/', attendance_history),
    path('leaderboard/', leaderboard_view),
    path('team/', team_view, name='team_view'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', logout),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('authenticated/', is_logged_in),
    path('clock/status/', clock_status, name='clock_status'),
     path('clock/record/<int:record_id>/', update_clock_record, name='update_clock_record'),
    path('employee/<str:username>/records/', employee_clock_records, name='employee_clock_records'),
]
 