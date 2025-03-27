from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import manager_overview, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('manager/overview/', manager_overview, name='manager-overview'),
    path('', include(router.urls)),
]
