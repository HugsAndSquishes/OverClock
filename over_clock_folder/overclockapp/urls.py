from django.urls import path
from .views import manager_overview

urlpatterns = [
    path('manager/overview/', manager_overview, name='manager-overview'),
]
