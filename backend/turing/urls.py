from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('uploadData/', views.uploadData, name='uploadData'),
    path('handlingMissingValues/', views.handlingMissingValues, name='handlingMissingValues'),
    path('handlingOutliers/', views.handlingOutliers, name='handlingOutliers'),
    path('handleEncoding/', views.handleEncoding, name='handleEncoding'),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)