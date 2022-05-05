"""calorienotesapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

from .views import RegisterView, CreateNotes, RetrieveUpdateNotes, RetrieveUpdateDiary, CreateDiary

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('notes/create/', CreateNotes.as_view(), name='create-notes'),
    path('notes/<int:year>/<int:month>/<int:day>/', RetrieveUpdateNotes.as_view(), name='retrieve-notes'),
    path('diary/create/', CreateDiary.as_view(), name='create-diary'),
    path('diary/', RetrieveUpdateDiary.as_view(), name='retrieve-update-diary')
]
