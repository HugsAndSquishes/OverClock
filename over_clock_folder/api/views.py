from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()

def is_manager(user):
    return user.is_authenticated and user.role == 'manager'

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_overview(request):
    employees_count = User.objects.filter(role='employee').count()
    return Response({
        "employees_count": employees_count,
        "message": "Welcome, Manager!",
    })

class UserViewSet(viewsets.ModelViewSet):
    """
    Your existing users list/create/update/delete endpoint.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def LoginAPI(request):
    """
    POST { "username": "..", "password": ".." } → sets a session cookie + returns user data
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if not user:
        return Response(
            { "detail": "Invalid credentials" },
            status=status.HTTP_401_UNAUTHORIZED
        )
    login(request, user)
    return Response(UserSerializer(user).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def LogoutAPI(request):
    """
    POST → clears session cookie
    """
    logout(request)
    return Response({ "detail": "Logged out" }, status=status.HTTP_200_OK)
