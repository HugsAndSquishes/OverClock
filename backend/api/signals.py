from django.db.models.signals import post_save, post_migrate
from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.contrib.auth import get_user_model


@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    for group_name in ['Employee', 'Manager', 'Administrator']:
        Group.objects.get_or_create(name=group_name)

'''

User = get_user_model()


@receiver(post_save, sender=User)
def assign_user_to_group(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'admin':
            group, created = Group.objects.get_or_create(name='Administrator')
            instance.groups.add(group)
        elif instance.role == 'manager':
            group, created = Group.objects.get_or_create(name='Manager')
            instance.groups.add(group)
        else:  
            # Default to 'employee'
            group, created = Group.objects.get_or_create(name='Employee')
            instance.groups.add(group)




@receiver(post_save, sender=User)
def sync_role_with_group(sender, instance, **kwargs):
    """
    Sync the user's 'role' field with the group they belong to.
    """
    if instance.groups.filter(name='Employee').exists():
        instance.role = 'employee'
    elif instance.groups.filter(name='Manager').exists():
        instance.role = 'manager'
    elif instance.groups.filter(name='Administrator').exists():
        instance.role = 'admin'
    else:
        instance.role = 'custom' 

    instance.save(update_fields=['role'])
'''