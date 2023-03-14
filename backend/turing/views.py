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
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
# For Encoding
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
# Create your views here.

exportData = ''

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/uploadData',
        '/api/handlingMissingValues',
        '/api/handlingOutliers',
        '/api/handleEncoding',
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
def handlingMissingValues(request):
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



@api_view(['POST'])
def handlingOutliers(request):
    if(request.method == 'POST'):
        file_name = request.data['file_name']
        col = request.data['col']
        print(col)
        selected_Method = request.data['selected_Method']
        file_path = 'static/files/'+str(file_name)
        data = pd.read_csv(file_path)
        # part of data that is required for handling outlier

        req_data = data[col]

        # for i in range(1, len(data)):
        #     data.iloc[i][col] = float(data.iloc[i][col]

        print(req_data)
        data_copy = data.copy()

        filtered_data = []
        outliers = []
        if(selected_Method == 'z-score'):
            threshold = 3
            mean = np.mean(req_data)
            std = np.std(req_data)

            for i in req_data:
                z_score = (i-mean)/std
                # Seperate the data points with a z-score above the threshold
                if(z_score < threshold):
                    filtered_data.append(i)
                else:
                    outliers.append(i)
            print(outliers)
            print(filtered_data)
            # return Response(filtered_data)
        elif(selected_Method == 'iqr'):
            q1, q3 = np.percentile(req_data, [25, 75])
            iqr = q3 - q1
            lower_bound = q1 - (1.5 * iqr)
            upper_bound = q3 + (1.5 * iqr)
            print(type(req_data))
            # ls = req_data.values
            # outliers = [x for x in req_data if x < lower_bound or x > upper_bound]
            # filtered_data = [x for x in req_data if x >= lower_bound and x <= upper_bound]

            for i in range(len(req_data)): 
                if (req_data[i]<lower_bound or req_data[i]>upper_bound):
                    outliers.append(req_data[i])
                    req_data[i] = None
            # req_data = pd.Series(ls)
            print(filtered_data)

        for i in range(len(req_data)): 
            if(req_data[i] in outliers):
                req_data[i]  = None

        imp = IterativeImputer(max_iter=10, random_state=0)
        req_data_series = pd.Series(req_data)
        smp = imp.fit_transform(req_data_series.values.reshape(-1, 1))

        data[col] = smp

        data = data.to_csv(index=False)
        return Response(data)



@api_view(['POST'])
def handleEncoding(request):
    
    return Response(request.data)


        