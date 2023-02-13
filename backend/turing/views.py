from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Data
from .serializers import DataSerializer
# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/uploadData',
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
