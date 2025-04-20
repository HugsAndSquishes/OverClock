from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import Group


# Create your views here.
'''
class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all()
        first_name = self.request.query_params.get('first_name')
        last_name = self.request.query_params.get('last_name')

        if first_name:
            queryset = queryset.filter(first_name__icontains=first_name)
        if last_name:
            queryset = queryset.filter(last_name__icontains=last_name)

        return queryset
'''
User = get_user_model()



def all_users(request):
    users = User.objects.all()
    data = [{
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'employee_id': user.employee_id,
        'role': user.role,
        'department': user.department.name if user.department else None,
    } for user in users]
    return JsonResponse(data, safe=False)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            print(f"Validation Error: {e.detail}")
            raise e

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

class AttendanceAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = AttendanceAdjustment.objects.all()
    serializer_class = AttendanceAdjustmentSerializer



