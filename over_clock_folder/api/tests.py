from django.test import TestCase
from django.urls import reverse
from .models import User

class CustomUserTestCase(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass',
            employee_id='EMP001',
            role='employee',
            sub_rank='Junior'
        )

    def test_get_users(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'testuser')

    def test_post_user(self):
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'employee_id': 'EMP002',
            'role': 'manager',
            'sub_rank': 'Senior'
        }
        response = self.client.post(reverse('user-list'), data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        new_user = User.objects.get(username='newuser')
        self.assertEqual(new_user.employee_id, 'EMP002')
        self.assertEqual(new_user.role, 'manager')

    def test_get_user_detail(self):
        response = self.client.get(reverse('user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'testuser')
        self.assertContains(response, 'EMP001')

    def test_update_user(self):
        data = {
            'username': 'updateduser',
            'employee_id': 'EMP003',
            'role': 'admin',
            'sub_rank': 'Executive'
        }
        response = self.client.put(
            reverse('user-detail', args=[self.user.id]),
            data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'updateduser')
        self.assertEqual(self.user.role, 'admin')

    def test_delete_user(self):
        response = self.client.delete(reverse('user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, 204)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())
