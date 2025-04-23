from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ClockRecord
from .serializers import ClockRecordSerializer, LeaderboardSerializer
from django.utils import timezone
from rest_framework import status

@api_view(['GET']) # IMPORTANT: Specify that this view only handles GET requests
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

        if employee_name:
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
def leaderboard_view(request):
    data = ClockRecord.get_leaderboard()
    serializer = LeaderboardSerializer(data, many=True)
    return Response(serializer.data)



@api_view(['POST'])
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