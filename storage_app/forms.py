"""
forms.py

Contains Django Form classes for handling user input.
Example: forms for file upload, chunk reassembly, or metadata submission.
"""


from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import FileMetadata


# Custom registration form that extends Django's built-in UserCreationForm
# Adds additional fields we need for our user profiles beyond the basic Django User model
class CustomUserCreationForm(UserCreationForm):
    full_name = forms.CharField(
        max_length=150,
        required=True,
        help_text="Enter your full name"
    )
    email = forms.EmailField(
        required=True,
        help_text="Enter a valid email address"
    )

    date_of_birth = forms.DateField(
        required=True,
        widget=forms.DateInput(attrs={'type': 'date'})  # Uses HTML5 date picker
    )
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    gender = forms.ChoiceField(choices=GENDER_CHOICES, required=True)

    class Meta:
        model = User
        # We use 'username' for login; full_name, date_of_birth, gender are extra fields.
        fields = ("username", "email" ,"full_name", "date_of_birth", "gender", "password1", "password2")

# Custom login form that enhances the default Django authentication form
class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'placeholder': 'Username', 'class': 'form-control'})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password', 'class': 'form-control'})
    )

# Form for handling file uploads to our storage system
# Collects both file metadata and the actual file content
class FileUploadForm(forms.ModelForm):
    class Meta:
        model = FileMetadata
        fields = ['file_name', 'description']

    file = forms.FileField(required=True)  # File field that gets stored in MinIO

