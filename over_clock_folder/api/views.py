from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

def is_manager(user):
    return user.is_authenticated and user.role == 'manager'

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_overview(request):
    employees_count = User.objects.filter(role='employee').count()

    data = {
        "employees_count": employees_count,
        "message": "Welcome, Manager!",
    }
    return Response(data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
