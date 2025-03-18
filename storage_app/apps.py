from django.apps import AppConfig

# It's automatically loaded when Django starts up based on the app's entry in INSTALLED_APPS

class StorageAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'  # Uses BigAutoField for primary keys
    name = 'storage_app'  
