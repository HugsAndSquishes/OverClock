from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ClockRecord, Team
from django.contrib.auth.models import User
from .serializers import ClockRecordSerializer, LeaderboardSerializer, UserSerializer, TeamSerializer
from django.utils import timezone
from rest_framework import status
from datetime import timedelta
from datetime import datetime

IS_PRODUCTION = False
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt


class CustomTokenObtainPairView(TokenObtainPairView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            serializer = UserSerializer(request.user, many=False)

            res = Response()
            res.data = {'success': True}

            # Use dev-friendly cookie settings
            cookie_secure = IS_PRODUCTION
            cookie_samesite = 'None' if IS_PRODUCTION else 'Lax'

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                path='/'
            )
            res.data.update(tokens)
            return res

        except Exception as e:
            print(e)
            return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)

class CustomTokenRefreshView(TokenRefreshView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']

            res = Response()
            res.data = {'refreshed': True}

            cookie_secure = IS_PRODUCTION
            cookie_samesite = 'None' if IS_PRODUCTION else 'Lax'

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})

@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {'success': True}

        cookie_secure = IS_PRODUCTION
        cookie_samesite = 'None' if IS_PRODUCTION else 'Lax'

        res.delete_cookie('access_token', path='/', samesite=cookie_samesite)
        res.delete_cookie('refresh_token', path='/', samesite=cookie_samesite)
        return res

    except Exception as e:
        print(e)
        return Response({'success': False})
    



@api_view(['GET']) # IMPORTANT: Specify that this view only handles GET requests
@permission_classes([IsAuthenticated])
def attendance_history(request):
    """
    API endpoint to retrieve attendance history (ClockRecord entries).

    Can optionally filter by 'employee_name' query parameter.
    Returns all ClockRecord entries if no 'employee_name' is provided.
    """
    # Get the 'employee_name' from query parameters (e.g., /api/history/?employee_name=JohnDoe)
    employee_name = request.query_params.get('employee_name', None)

    try:
        queryset = ClockRecord.objects.all() # Start with all records

        if (employee_name):
            # If employee_name is provided in the URL, filter the queryset
            queryset = queryset.filter(employee_name__iexact=employee_name) # Case-insensitive filter

        # Order results (optional, but good for consistency)
        queryset = queryset.order_by('-day', 'employee_name')

        # Serialize the queryset
        # We need fields like 'day' and 'employee_name' for the frontend.
        # ClockRecordSerializer uses fields = '__all__', so it includes them.
        serializer = ClockRecordSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        # Log the exception for debugging on the server
        print(f"Error in attendance_history view: {e}")
        # Return a generic server error response
        return Response(
            {"error": "An error occurred while retrieving attendance history."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_view(request):
    data = ClockRecord.get_leaderboard()
    serializer = LeaderboardSerializer(data, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clock_action(request):
    print("Request data:", request.data)

    data = request.data
    employee_name = data.get('employee_name')
    action = data.get('action')

    if not employee_name or not action:
        return Response({"error": "Missing required fields"}, status=400)

    # Use server's current time instead of client-provided timestamp
    aware_time = timezone.now()

    if action == 'clock_in':
        record = ClockRecord.objects.create(
            employee_name=employee_name,
            clock_in_time=aware_time,
            day=aware_time.date() 
        )
        return Response({
            "status": "clocked_in",
            "id": record.id
        })

    elif action == 'clock_out':
        try:
            record = ClockRecord.objects.filter(
                employee_name=employee_name,
                clock_out_time__isnull=True
            ).last()

            if not record:
                raise Exception("No active clock-in found")

            record.clock_out_time = aware_time

            # Calculate total hours
            total_seconds = (record.clock_out_time - record.clock_in_time).total_seconds()
            hours_worked = round(total_seconds / 3600, 2)
            record.total_hours = hours_worked  # Ensure this field exists in the model
            record.save()

            return Response({
                "status": "clocked_out",
                "id": record.id,
                "hours": hours_worked
            })

        except Exception as e:
            print("Error during clock-out:", str(e))
            return Response({"error": str(e)}, status=400)

    else:
        return Response({"error": "Invalid action"}, status=400)
    




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def clock_status(request):
    """Get the current clock status for the authenticated user"""
    username = request.user.username
    now = timezone.now()
    today = now.date()
    
    # Check if user is currently clocked in
    active_record = ClockRecord.objects.filter(
        employee_name=username,
        clock_in_time__isnull=False,
        clock_out_time__isnull=True
    ).first()
    
    # Calculate today's hours
    today_records = ClockRecord.objects.filter(
        employee_name=username,
        day=today,
        clock_out_time__isnull=False
    )
    today_hours = sum((record.clock_out_time - record.clock_in_time).total_seconds() / 3600 
                    for record in today_records)
    
    # Calculate weekly hours
    week_start = today - timedelta(days=today.weekday())
    week_records = ClockRecord.objects.filter(
        employee_name=username,
        day__gte=week_start,
        day__lte=today,
        clock_out_time__isnull=False
    )
    weekly_hours = sum((record.clock_out_time - record.clock_in_time).total_seconds() / 3600 
                    for record in week_records)
    
    return Response({
        'is_clocked_in': active_record is not None,
        'current_record_id': active_record.id if active_record else None,
        'today_hours': today_hours,
        'weekly_hours': weekly_hours
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    print(f"--- is_logged_in: Authenticated user: {request.user}") # DEBUG
    
    # Check if user is in the "Managers" group
    is_manager = request.user.groups.filter(name='Managers').exists()
    
    # Get the base user data
    user_data = UserSerializer(request.user, many=False).data
    
    # Add the manager status to the response
    user_data['is_manager'] = is_manager
    
    return Response(user_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_view(request):
    """Get all teams and all employees for managers"""
    if request.user.groups.filter(name='Managers').exists():
        # If user is a manager, get all teams and all employees
        teams = Team.objects.all()
        employees = User.objects.filter(groups__name='Employees')
        
        team_serializer = TeamSerializer(teams, many=True)
        employee_serializer = UserSerializer(employees, many=True)
        
        return Response({
            'teams': team_serializer.data,
            'employees': employee_serializer.data
        })
    else:
        # Regular users just see their own teams
        teams = request.user.team_set.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_clock_record(request, record_id):
    """Update an existing clock record - only managers can do this"""
    if not request.user.groups.filter(name='Managers').exists():
        return Response({"error": "Only managers can edit clock records"}, status=403)
    
    try:
        record = ClockRecord.objects.get(id=record_id)
    except ClockRecord.DoesNotExist:
        return Response({"error": "Record not found"}, status=404)
    
    # Parse the incoming time data
    clock_in_time = request.data.get('clock_in_time')
    clock_out_time = request.data.get('clock_out_time')
    
    if clock_in_time:
        try:
            record.clock_in_time = timezone.make_aware(datetime.fromisoformat(clock_in_time.replace('Z', '+00:00')))
        except Exception as e:
            return Response({"error": f"Invalid clock-in time format: {str(e)}"}, status=400)
    
    if clock_out_time:
        try:
            record.clock_out_time = timezone.make_aware(datetime.fromisoformat(clock_out_time.replace('Z', '+00:00')))
        except Exception as e:
            return Response({"error": f"Invalid clock-out time format: {str(e)}"}, status=400)
    
    record.save()
    return Response(ClockRecordSerializer(record).data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_clock_records(request, username):
    """Get clock records for a specific employee - only managers can access other users' records"""
    is_manager = request.user.groups.filter(name='Managers').exists()
    
    # Regular users can only access their own records
    if not is_manager and request.user.username != username:
        return Response({"error": "You don't have permission to view these records"}, status=403)
    
    # Get date filters from query params
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    records = ClockRecord.objects.filter(employee_name=username)
    
    if start_date:
        try:
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            records = records.filter(day__gte=start)
        except ValueError:
            pass
    
    if end_date:
        try:
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
            records = records.filter(day__lte=end)
        except ValueError:
            pass
    
    records = records.order_by('-day')
    return Response(ClockRecordSerializer(records, many=True).data)