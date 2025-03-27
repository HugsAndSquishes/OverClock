from django import forms
from .models import Attendance

class AttendanceForm(forms.ModelForm):
    class Meta:
        model = Attendance
        fields = ['user', 'date', 'status', 'clock_in_time', 'clock_out_time']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'clock_in_time': forms.TimeInput(attrs={'type': 'time'}),
            'clock_out_time': forms.TimeInput(attrs={'type': 'time'}),
        }
