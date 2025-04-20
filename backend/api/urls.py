from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from . import views

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'payroll', PayrollViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'adjustments', AttendanceAdjustmentViewSet)
router.register(r'groups', GroupViewSet, basename='group')

urlpatterns = [
    path('', include(router.urls)),
    path('api/users/', views.all_users, name='all_users'),
]
