from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from .models import ClockLog
from .serializers import ClockLogSerializer

@api_view(['POST'])
def clock_action(request):
    if request.method == 'POST':
        # Debug print the incoming request data
        print("Received request data:", request.data)
        
        action = request.data.get('action')
        timestamp = request.data.get('timestamp')
        
        if not action or not timestamp:
            return Response({
                'error': 'Missing required fields',
                'details': f'Both action and timestamp are required. Received: action={action}, timestamp={timestamp}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if action == 'clock_in':
            employee_name = request.data.get('employee_name')
            if not employee_name:
                return Response({
                    'error': 'Missing required fields',
                    'details': 'employee_name is required for clock in'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            serializer = ClockLogSerializer(data={
                'action': 'Clock In',
                'timestamp': timestamp,
                'employee_name': employee_name
            })
            if serializer.is_valid():
                clock_log = serializer.save()
                return Response({
                    'id': clock_log.id,
                    'message': 'Successfully clocked in'
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif action == 'clock_out':
            clock_in_id = request.data.get('id')
            if not clock_in_id:
                return Response({
                    'error': 'Missing required fields',
                    'details': f'id is required for clock out. Received data: {request.data}'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                clock_in_record = ClockLog.objects.get(id=clock_in_id)
                # Create clock out record
                serializer = ClockLogSerializer(data={
                    'action': 'Clock Out',
                    'timestamp': timestamp,
                    'employee_name': clock_in_record.player.username
                })
                if serializer.is_valid():
                    clock_out = serializer.save()
                    # Calculate hours
                    clock_in_time = datetime.fromisoformat(clock_in_record.timestamp.isoformat())
                    clock_out_time = datetime.fromisoformat(clock_out.timestamp.isoformat())
                    hours = (clock_out_time - clock_in_time).total_seconds() / 3600
                    return Response({
                        'message': 'Successfully clocked out',
                        'hours': round(hours, 2)
                    })
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except ClockLog.DoesNotExist:
                return Response({
                    'error': 'Clock in record not found',
                    'details': f'No clock in record found with id {clock_in_id}'
                }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({
                    'error': 'Server error',
                    'details': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'error': 'Invalid action',
            'details': f'Action must be either "clock_in" or "clock_out", received "{action}"'
        }, status=status.HTTP_400_BAD_REQUEST) 