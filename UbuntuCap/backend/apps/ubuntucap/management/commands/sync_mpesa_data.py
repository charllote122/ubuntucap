from django.core.management.base import BaseCommand
from apps.ubuntucap.services.mpesa_sync import MpesaDataSync

class Command(BaseCommand):
    help = 'Sync M-Pesa transaction data for all users'
    
    def handle(self, *args, **options):
        sync_service = MpesaDataSync()
        synced_count = sync_service.sync_all_active_users()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully synced M-Pesa data for {synced_count} users')
        )