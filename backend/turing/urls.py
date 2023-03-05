from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('uploadData/', views.uploadData, name='uploadData'),
    path('dataPreprocessing/', views.dataPreprocessing, name='dataPreprocessing'),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)