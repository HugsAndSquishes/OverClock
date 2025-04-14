from rest_framework import serializers
from .models import ClockRecord

class ClockRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClockRecord
        fields = '__all__'
