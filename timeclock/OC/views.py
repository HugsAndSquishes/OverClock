from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ClockRecord
from .serializers import ClockRecordSerializer
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from datetime import datetime

@api_view(['POST'])
def clock_action(request):
    print("Request data:", request.data)

    data = request.data
    employee_name = data.get('employee_name')
    action = data.get('action')
    timestamp = data.get('timestamp')

    if not employee_name or not action or not timestamp:
        return Response({"error": "Missing required fields"}, status=400)

    # Convert timestamp string to timezone-aware datetime object
    try:
        parsed_time = parse_datetime(timestamp)
        if parsed_time is None:
            raise ValueError("Invalid datetime format")
        aware_time = make_aware(parsed_time)
    except Exception as e:
        return Response({"error": f"Invalid timestamp format: {str(e)}"}, status=400)

    if action == 'clock_in':
        record = ClockRecord.objects.create(
            employee_name=employee_name,
            clock_in_time=aware_time
        )
        return Response({
            "status": "clocked_in",
            "id": record.id
        })

    elif action == 'clock_out':
        try:
            # Get the most recent open clock-in for the employee
            record = ClockRecord.objects.filter(
                employee_name=employee_name,
                clock_out_time__isnull=True
            ).last()

            if not record:
                raise Exception("No active clock-in found")

            record.clock_out_time = aware_time
            record.save()

            # If using a property method for total_hours
            total_hours = record.total_hours

            return Response({
                "status": "clocked_out",
                "id": record.id,
                "total_hours": total_hours
            })

        except Exception as e:
            print("Error during clock-out:", str(e))
            return Response({"error": str(e)}, status=400)

    else:
        return Response({"error": "Invalid action"}, status=400)
