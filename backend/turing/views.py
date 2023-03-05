from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.staticfiles import finders
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Data
from .serializers import DataSerializer
import os
import json



#machine learing modules
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
# Create your views here.

exportData = ''

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/uploadData',
        '/api/dataPreprocessing',
        '/api/dataAnalysis',
        '/api/dataPrediction',
        '/api/dataVisualization',
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
def uploadData(request):
    if request.method == 'POST':
        serializers = DataSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.data,status=status.HTTP_201_CREATED)
    elif request.method == 'GET':
        data = Data.objects.all()
        serializers = DataSerializer(data,many=True)
        return Response(serializers.data[len(data) - 1])


@api_view(['POST'])
def dataPreprocessing(request):
    if(request.method == 'POST'):
        file_name = request.data['file_name']
        opr = request.data['opr']
        selected_Col = request.data['selected_Col'].split(",")

        file_path = 'static/files/'+str(file_name)
        df = pd.read_csv(file_path)

        df_copy = df.copy()

        imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
        if opr == 'drop':
            df_copy = df_copy.dropna()
        elif opr == 'mean' or opr == 'median':
            imputer = SimpleImputer(missing_values=np.nan, strategy=opr)
        else:
            imputer = SimpleImputer(strategy='constant', fill_value=0)
        
        df_copy.loc[:, selected_Col] = imputer.fit_transform(df_copy.loc[:, selected_Col])
        csv_data = df_copy.to_csv(index=False)
        return Response(csv_data)
        