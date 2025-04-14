from django.urls import path
from . import views

urlpatterns = [
    path('api/clock/', views.clock_action, name='clock_action'),
] 