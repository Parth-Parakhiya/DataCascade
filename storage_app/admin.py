from django.contrib import admin
from .models import FileMetadata  # Import your model
from .models import FileChunk

# Register the models for admin interface
# This allows us to view and manage file metadata and chunks directly in Django's admin panel
# FileMetadata stores information about uploaded files (name, size, etc.)
# FileChunk stores the actual binary data of files split into manageable pieces
admin.site.register(FileMetadata)
admin.site.register(FileChunk)
