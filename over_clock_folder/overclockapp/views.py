from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model


def is_manager(user):
    return user.is_authenticated and user.role == 'manager'

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_overview(request):

    User = get_user_model()
    employees_count = User.objects.filter(role='employee').count()

    data = {
        "employees_count": employees_count,
        "message": "Welcome, Manager!",
    }
    return Response(data)