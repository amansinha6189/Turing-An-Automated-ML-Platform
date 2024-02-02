from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('sendTargetType/', views.sendTargetType, name='sendTargetType'),
    path('uploadData/', views.uploadData, name='uploadData'),
    path('getData/', views.getData, name='getData'),
    path('handleTargetValueData/', views.targetValueData, name='targetValueData'),
    path('autoEDA/', views.autoEDA, name='autoEDA'),
    path('getOverviewOfData/', views.getOverviewOfData, name='getOverviewOfData'),
    path('handlingMissingValues/', views.handlingMissingValues, name='handlingMissingValues'),
    path('handlingOutliers/', views.handlingOutliers, name='handlingOutliers'),
    path('handleEncoding/', views.handleEncoding, name='handleEncoding'),
    path('trainTestDataSet/', views.trainTestDataSet, name='trainTestDataSet'),
    path('handleFeatureScaling/', views.handleFeatureScaling, name='handleFeatureScaling'),
    path('handleLinearRegression/', views.LinearReg, name='LinearReg'),
    path('handleLassoRegression/', views.LassoRegression, name='LassoRegression'),
    path('handleRidgeRegression/', views.RidgeRegression, name='RidgeRegression'),
    path('handleDecisionTreeRegression/', views.DecisionTreeRegression, name='DecisionTreeRegression'),
    path('handleRandomForestRegression/', views.RandomForestRegression, name='RandomForestRegression'),
    path('handleKNeighborsRegression/', views.KNeighborsRegression, name='KNeighborsRegression'),
    path('handleSVMRegression/', views.SVMRegression, name='SVMRegression'),
    path('handleLogisticRegression/', views.LogisticReg, name='LogisticReg'),
    path('handleSVMClassification/', views.SVMClassification, name='SVMClassification'),
    path('handleKNeighborsClassification/', views.KNeighborsClassification, name='KNeighborsClassification'),
    path('handleNaiveByes/', views.NaiveByes, name='NaiveByes'),
    path('handleRandomForestClassification/', views.RandomForestClassification, name='RandomForestClassification'),
    path('handleDecisionTreeClassification/', views.DecisionTreeClassification, name='DecisionTreeClassification'),
    path('handleKMeansClusterring/', views.KMeansClusterring, name='KMeansClusterring'),
    path('handleModelScore/', views.ModelScore, name='ModelScore'),
    path('downloadModel/', views.downloadModel, name='downloadModel'),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)