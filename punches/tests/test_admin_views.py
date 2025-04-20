import pytest

from django.contrib.auth.models import User
from punches.models import Attendance


def test_admin_connection(admin_client):
    response = admin_client.get(path='/admin/')
    assert 200 == response.status_code


@pytest.mark.django_db
def test_admin_login(client):
    user = User.objects.create_superuser(username='Addy', password='securepassword')
    client.login(username=user.username, password='securepassword')
    response = client.get(path='/admin/')
    assert 200 == response.status_code


@pytest.mark.django_db
def test_non_admin_login(client):
    '''
        If a non admin attempts to access the admin interface, they should be redirected
    '''
    user = User.objects.create_user(username='Billy', password='password')
    client.login(username=user.username, password='password')
    response = client.get(path='/admin/')
    assert 302 == response.status_code

@pytest.mark.django_db
def test_user_deletion(client):
    '''
        When a user is deleted all of their punches should also be deleted
    '''
    admin_user = User.objects.create_superuser(username='Addy', password='securepassword')
    client.login(username=admin_user.username, password='securepassword')
    user = User.objects.create_user(username='Billy', password='password')
    attendance_1 = Attendance.objects.create(clock_type="IN", status="Present", user=user)
    attendance_2 = Attendance.objects.create(clock_type="OUT", status="Present", user=user)
    attendance_3 = Attendance.objects.create(clock_type="IN", status="Present", user=user)
    attendance_4 = Attendance.objects.create(clock_type="OUT", status="Present", user=user)
    
    assert 4 == Attendance.objects.all().count()
    response = client.get(path='/admin/punches/attendance/')
    assert 200 == response.status_code

    user.delete()
    assert 0 == Attendance.objects.all().count()

    
    
    

#employee = User.objects.create_user("Billy", "billyBob@work.com", "password")
