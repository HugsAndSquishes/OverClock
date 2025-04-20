from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    manager_overview, UserViewSet,
    LoginAPI, LogoutAPI
)

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('manager/overview/', manager_overview, name='manager-overview'),
    path('', include(router.urls)),

    path('login/',  LoginAPI,  name='api-login'),
    path('logout/', LogoutAPI, name='api-logout'),
    
]
