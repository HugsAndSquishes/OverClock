from rest_framework import serializers
from .models import Department, Attendance, Payroll, Leaderboard, AttendanceAdjustment
from django.contrib.auth.models import Group

from django.contrib.auth import get_user_model
User = get_user_model() 



class DepartmentSerializer(serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    manager_username = serializers.CharField(source='manager.username', read_only=True)
    manager_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'manager', 'manager_username', 'manager_full_name']

    def get_manager_full_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}".strip()
        return None


class UserSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'employee_id', 'department', 'department_name']

        '''
        extra_kwargs = {
            'password': {'write_only': True}
        }
        '''
    '''
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            employee_id=validated_data.get('employee_id', ''),
            #role=validated_data.get('role', 'employee'),
        )
        return user
    '''


class UserNestedSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'employee_id',
            'sub_rank',
            'department',
            'department_name',
        ]
        read_only_fields = fields


class UserNestedSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'employee_id',
            'sub_rank',
            'department',
            'department_name',
        ]
        read_only_fields = fields

class AttendanceSerializer(serializers.ModelSerializer):
    user = UserNestedSerializer(read_only=True)
    employee_id = serializers.CharField(write_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee_id',
            'user',
            'clock_in',
            'clock_out',
            'total_hours',
        ]
        read_only_fields = ['total_hours'] 

    def create(self, validated_data):
        employee_id = validated_data.pop('employee_id')
        try:
            user = User.objects.get(employee_id=employee_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'employee_id': f'No user found with employee ID: {employee_id}'
            })

        attendance = Attendance(user=user, **validated_data)
        attendance.total_hours = self.calculate_total_hours(
            attendance.clock_in, attendance.clock_out
        )
        attendance.save()
        return attendance

    def update(self, instance, validated_data):
        if 'employee_id' in validated_data:
            employee_id = validated_data.pop('employee_id')
            try:
                user = User.objects.get(employee_id=employee_id)
                instance.user = user
            except User.DoesNotExist:
                raise serializers.ValidationError({
                    'employee_id': f'No user found with employee ID: {employee_id}'
                })

        instance.clock_in = validated_data.get('clock_in', instance.clock_in)
        instance.clock_out = validated_data.get('clock_out', instance.clock_out)
        instance.total_hours = self.calculate_total_hours(instance.clock_in, instance.clock_out)
        instance.save()
        return instance

    def calculate_total_hours(self, clock_in, clock_out):
        if clock_in and clock_out:
            duration = clock_out - clock_in
            return round(duration.total_seconds() / 3600, 2)
        return 0


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class AttendanceAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceAdjustment
        fields = '__all__'