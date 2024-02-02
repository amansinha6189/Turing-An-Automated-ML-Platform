from django.conf import settings
from django.http import FileResponse
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
import joblib


#machine learing modules
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
# For Handling Missing Data
from sklearn.impute import SimpleImputer
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
# For Encoding
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import LabelEncoder
#For Slittling in training and test set 
from sklearn.model_selection import train_test_split
# For Featture Scaling
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import RobustScaler
from sklearn.preprocessing import Normalizer
# For Refression
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Lasso
from sklearn.linear_model import Ridge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
# For Classification
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB  
from sklearn.tree import DecisionTreeClassifier 
from sklearn.ensemble import RandomForestClassifier
# For Clustering
from sklearn.cluster import KMeans
# For Model Performance
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, explained_variance_score
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score, adjusted_rand_score, rand_score
# Create your views here.

# Some Global Variable
target_type = "NonCategorical"
file_name = ""
target_col = ""
target_exists = ""
X_train = []
X_test = [] 
Y_train = []
Y_test = []
model = LinearRegression()

Data

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/uploadData',
        '/api/handlingMissingValues',
        '/api/handlingOutliers',
        '/api/handleEncoding',
        '/api/handleFeatureScaling',
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
def getData(request):
    if(request.method == 'POST'):
        # file_name = request.data['file_name']
        global file_name
        file_path = 'static/files/'+str(file_name)
        df = pd.read_csv(file_path)
        df = df.to_csv()
        return Response(df)
        


@api_view(['POST'])
def targetValueData(request):
    if(request.method == 'POST'):
        global target_exists, target_col, target_type
        target_exists = request.data['target_exists']
        target_col = request.data['target_col'].strip()
        target_type = request.data['target_type']

        print(target_exists, target_col, target_type)
    return Response("Success")

@api_view(['GET', 'POST'])
def sendTargetType(request):
    if(request.method == 'POST'):
        global target_type
        return Response(target_type)

@api_view(['GET'])
def autoEDA(request):
    if(request.method == 'GET'):
        html_path = 'static/EDA/' + 'sweet_report.html'
        # with open(html_path, 'r') as file:
        #     html = file.read()
        # return HttpResponse({"html": html})
        return render(request, html_path)

@api_view(['POST'])
def getOverviewOfData(request):
    if(request.method == 'POST'):
        global file_name
        file_name = request.data['file_name']

        file_path = 'static/files/'+str(file_name)
        df = pd.read_csv(file_path)

        desc = df.describe(include='all').drop(['unique','top','freq'])

        unique_val = [len(df[i].unique()) for i in desc.columns]
        null_val = [df[i].isnull().sum() for i in desc.columns]

        desc = desc.fillna(value = '-',inplace= False)

        desc.loc["unique"] = unique_val
        desc.loc["null"] = null_val

        desc = desc.reindex(['count','null','unique','mean','std','min','25%', '50%', '75%','max'])

        # print(df.info())
        # print("type of info ", type(df.info()))
        print(desc)
        print("type of desciribe ", type(desc))

        overview = desc.to_csv()
    return Response(overview)




@api_view(['POST'])
def handlingMissingValues(request):
    if(request.method == 'POST'):
        try:
            file_name = request.data['file_name']
            opr = request.data['opr']
            selected_Col = request.data['selected_Col'].split(",")
            print(selected_Col)
            print(type(selected_Col))

            for col in selected_Col:
                col = col.strip()

            # for i in range(0, len(selected_Col)):
            #     selected_Col = [float(x) for x in selected_Col[i]]

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
            df_copy.to_csv(file_path, index=False, mode = 'w')
            data = df_copy.to_csv(index=False)
            return Response(data)
        except Exception as e:
            error_message = str(e)
            error_response = {'error': error_message}
            print(error_message)
            return Response(error_response, status=500)
       



@api_view(['POST'])
def handlingOutliers(request):
    if(request.method == 'POST'):
        try:
            file_name = request.data['file_name']
            col = request.data['col']
            print(col)
            selected_Method = request.data['selected_Method']
            file_path = 'static/files/'+str(file_name)
            data = pd.read_csv(file_path)
            # part of data that is required for handling outlier
            for col in col:
                col = col.strip()
            req_data = data[col]

            # for i in range(1, len(data)):
            #     data.iloc[i][col] = float(data.iloc[i][col]

            print(req_data)
            # data_copy = data.copy()

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

            data.to_csv(file_path, index=False, mode = 'w')
            data = data.to_csv(index=False)
            return Response(data)
        except Exception as e:
            error_message = str(e)
            error_response = {'error': error_message}
            print(error_message)
            return Response(error_response, status=500)



@api_view(['POST'])
def handleEncoding(request):
    if(request.method == 'POST'):
        try:
            varType = request.data['varType']
            col = request.data['col']
            # method = request.data['method']
            file_name = request.data['file_name']

            file_path = 'static/files/'+str(file_name)
            data = pd.read_csv(file_path)

            # for col in col:
            #     col = col.strip()

            req_data = data[col]
            req_data_encoded = []
            if(varType == 'independent'):
                one_hot_encoded = pd.get_dummies(data[col])
                data = pd.concat([data, one_hot_encoded], axis=1)
                data = data.drop(col, axis=1)
                print(data)
            elif(varType == 'dependent'):
                le = LabelEncoder()
                req_data_encoded = le.fit_transform(req_data)
                data[col] = req_data_encoded
                print(req_data_encoded)

            
            data.to_csv(file_path, index=False, mode = 'w')
            data = data.to_csv(index = False)
            print(data)
            return Response(data)
        except Exception as e:
            error_message = str(e)
            error_response = {'error': error_message}
            print(error_message)
            return Response(error_response, status=500)

        

@api_view(['POST'])
def trainTestDataSet(request):
    if(request.method == 'POST'):
        try:
            file_name = request.data['file_name']
            ratio = float(request.data['ratio'])

            file_path = 'static/files/'+str(file_name)
            data = pd.read_csv(file_path)

            global target_exists, target_col

            if(target_exists == "true"):
                X = data.drop(target_col, axis=1).values
                Y = data[target_col].values

                global X_train, X_test, Y_train, Y_test 
                X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=ratio, random_state=42)
                print(X_train, Y_train, X_test, Y_test)
            data = data.to_csv(index = False)
            return Response(data)
        except Exception as e:
            error_message = str(e)
            error_response = {'error': error_message}
            print(error_message)
            return Response(error_response, status=500)




@api_view(['POST'])
def handleFeatureScaling(request):
    if(request.method == 'POST'):
        try:
            file_name = request.data['file_name']
            method = request.data['method']
            cols_for_feature_scaling = request.data['col'].split(",")
            cols = request.data['cols'].split(",")
            print(cols)
            print(cols_for_feature_scaling)
            global X_train, X_test, Y_train, Y_test 

            # for col in cols_for_feature_scaling:
            #     col = col.strip()
            
            # for col in cols:
            #     col = col.strip()


            file_path = 'static/files/'+str(file_name)  
            data = pd.read_csv(file_path)
        
            X_train_df = pd.DataFrame(X_train)
            X_test_df = pd.DataFrame(X_test)
        
            if method == 'StandardScaler':
                opr = StandardScaler()
            elif method == 'MinMaxScaler':
                opr = MinMaxScaler()
            elif method == 'RobustScaler':
                opr = RobustScaler()
            else:
                opr = Normalizer()
            

            for col in cols_for_feature_scaling:
                idx = cols.index(str(col))
                df_train = X_train_df[idx].to_frame()
                df_test = X_test_df[idx].to_frame()
                df_train = opr.fit_transform(df_train)
                df_test = opr.transform(df_test)
                data[[col]] = opr.transform(data[[col]])
                X_train_df[idx] = df_train
                X_test_df[idx] = df_test

            X_train = X_train_df
            X_test = X_test_df

            print(X_train)
            print(X_test)
            print(data)
            data.to_csv(file_path, index=False, mode = 'w')
            data = data.to_csv(index = False)
            return Response(data)
        except Exception as e:
            error_message = str(e)
            error_response = {'error': error_message}
            print(error_message)
            return Response(error_response, status=500)


@api_view(['POST'])
def LinearReg(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model
        
        model = LinearRegression()
        model.fit(X_train, Y_train)

        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")

@api_view(['POST'])
def LassoRegression(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 
        a = float(request.POST.get('alpha'))

        model = Lasso(alpha = a)
        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")

@api_view(['POST'])
def RidgeRegression(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model
        a = float(request.POST.get('alpha'))

        model = Ridge(alpha = a)
        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")

@api_view(['POST'])
def DecisionTreeRegression(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test , model
        if request.data['max_depth'] == 'null' :
            max_depth = None
        else:
            max_depth = int(request.data['max_depth'])


        min_samples_split = int(request.data['min_samples_split'])
        min_samples_leaf = int(request.data['min_samples_leaf'])
        if request.data['max_features'] == 'null' :
            max_features = None
        else:
            max_features = float(request.data['max_features'])

            
        min_weight_fraction_leaf = float(request.data['min_weight_fraction_leaf'])

        if request.data['random_state'] == 'null' :
            random_state = None
        else:
            random_state = float(request.data['random_state'])


        print(max_depth, min_samples_split, min_samples_leaf, max_features, min_weight_fraction_leaf, random_state)
        
        model = DecisionTreeRegressor(max_depth=max_depth, min_samples_split=min_samples_split, min_samples_leaf=min_samples_leaf, max_features=max_features, min_weight_fraction_leaf=min_weight_fraction_leaf, random_state=random_state)

        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")

@api_view(['POST'])
def RandomForestRegression(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 

        n_estimators = int(request.data['n_estimators'])
        min_samples_split = int(request.data['min_samples_split'])

        if request.data['max_features'] == 'null' :
            max_features = None
        else:
            max_features = int(request.data['max_features'])

        if request.data['max_depth'] == 'null' :
            max_depth = None
        else:
            max_depth = float(request.data['max_depth'])

        min_samples_leaf = int(request.data['min_samples_leaf'])
        
        if request.data['bootstrap'] == 'true' :
            bootstrap = True
        else:
            bootstrap = False
        
        model = RandomForestRegressor(n_estimators = n_estimators, bootstrap = bootstrap, max_depth = max_depth, min_samples_split = min_samples_split, max_features = max_features, min_samples_leaf = min_samples_leaf)

        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")


@api_view(['POST'])
def KNeighborsRegression(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 
        leaf_size = int(request.data['leaf_size'])
        n_neighbors = int(request.data['n_neighbors'])
        p = int(request.data['p'])

        model = KNeighborsRegressor(leaf_size = leaf_size, n_neighbors = n_neighbors, p = p)
        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")


@api_view(['POST'])
def SVMRegression(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 

        kernel = request.data['kernel']
        C = float(request.data['C'])

        model = SVR(kernel = kernel, C = C)
        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")


@api_view(['POST'])
def LogisticReg(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 
        
        model = LogisticRegression()
        model.fit(X_train, Y_train)


        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")

@api_view(['POST'])
def SVMClassification(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 

        kernel = request.data['kernel']
        C = float(request.data['C'])

        model = SVC(kernel = kernel, C = C)
        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")

@api_view(['POST'])
def KNeighborsClassification(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 
        leaf_size = int(request.data['leaf_size'])
        n_neighbors = int(request.data['n_neighbors'])
        p = int(request.data['p'])

        model = KNeighborsClassifier(leaf_size = leaf_size, n_neighbors = n_neighbors, p = p)
        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")


@api_view(['POST'])
def NaiveByes(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 
        
        model = GaussianNB()
        model.fit(X_train, Y_train)


        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")



@api_view(['POST'])
def RandomForestClassification(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 

        n_estimators = int(request.data['n_estimators'])
        min_samples_split = int(request.data['min_samples_split'])

        if request.data['max_features'] == 'null' :
            max_features = None
        else:
            max_features = int(request.data['max_features'])

        if request.data['max_depth'] == 'null' :
            max_depth = None
        else:
            max_depth = float(request.data['max_depth'])

        min_samples_leaf = int(request.data['min_samples_leaf'])
        
        if request.data['bootstrap'] == 'true' :
            bootstrap = True
        else:
            bootstrap = False
        
        model = RandomForestClassifier(n_estimators = n_estimators, bootstrap = bootstrap, max_depth = max_depth, min_samples_split = min_samples_split, max_features = max_features, min_samples_leaf = min_samples_leaf)

        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")




@api_view(['POST'])
def DecisionTreeClassification(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, model 
        if request.data['max_depth'] == 'null' :
            max_depth = None
        else:
            max_depth = int(request.data['max_depth'])


        min_samples_split = int(request.data['min_samples_split'])
        min_samples_leaf = int(request.data['min_samples_leaf'])
        if request.data['max_features'] == 'null' :
            max_features = None
        else:
            max_features = float(request.data['max_features'])

            
        min_weight_fraction_leaf = float(request.data['min_weight_fraction_leaf'])

        if request.data['random_state'] == 'null' :
            random_state = None
        else:
            random_state = float(request.data['random_state'])


        print(max_depth, min_samples_split, min_samples_leaf, max_features, min_weight_fraction_leaf, random_state)
        
        model = DecisionTreeClassifier(max_depth=max_depth, min_samples_split=min_samples_split, min_samples_leaf=min_samples_leaf, max_features=max_features, min_weight_fraction_leaf=min_weight_fraction_leaf, random_state=random_state)

        model.fit(X_train, Y_train)
        print(Y_test[0])
        print(model.predict([X_test[0]]))

        return Response("success")




@api_view(['POST'])
def KMeansClusterring(request):
    if(request.method == 'POST'):
        X = np.random.randn(1000, 2)
        global X_train, X_test, Y_train, Y_test, model 
        if request.data['random_state'] == 'null' :
            random_state = None
        else:
            random_state = int(request.data['random_state'])


        init = request.data['init']
        n_clusters = int(request.data['n_clusters'])
        print(random_state, n_clusters, init)
        model = KMeans(random_state = random_state, n_clusters = 8, init = init)
        model.fit(X)

        y_pred = model.predict(X)
        plt.scatter(X[:,0], X[:,1], c=y_pred)
        plt.show()

        return Response("success")



@api_view(['POST'])
def ModelScore(request):
    if(request.method == 'POST'):
        global X_train, X_test, Y_train, Y_test, target_type, model
        print(type(model))
        y_pred = model.predict(X_test)
        print(Y_test.shape)
        print(y_pred.shape)
        
        score = []
        
        if(target_type == 'NonCategorical'):
            mae = mean_absolute_error(Y_test, y_pred)
            mse = mean_squared_error(Y_test, y_pred)
            rmse = mean_squared_error(Y_test, y_pred, squared=False)
            r2 = r2_score(Y_test, y_pred)
            n_features = X_train.shape[1]
            def adj_r2_score(Y_test, y_pred, n_features):
                r2 = r2_score(Y_test, y_pred)
                adj_r2 = 1 - ((1 - r2) * (len(Y_test) - 1) / (len(Y_test) - n_features - 1))
                return adj_r2

            adj_r2 = adj_r2_score(Y_test, y_pred, n_features)
            evs = explained_variance_score(Y_test, y_pred)

            score = [["Mean Absolute Error", mae] ,
                    ["Mean Squared Error", mse],
                    ["Root Mean Squared Error", rmse] ,
                    ["R2", r2],
                    ["ADJ R2 Score", adj_r2],
                    ["Explained Variance Score",  evs]]
            print(type(score))
            df = pd.DataFrame(score, columns=['Properties', 'Score'])
            df = df.to_csv()
            return Response(df)

        elif target_type == "Categorical":
            accuracy = accuracy_score(Y_test, y_pred)
            print("Accuracy -> ", accuracy)
            print(type(accuracy))
            conf_mat = confusion_matrix(Y_test, y_pred)
            print(type(conf_mat))
            print(conf_mat)
            df = pd.DataFrame(conf_mat)
            df = df.to_csv()
            print("conf_mat -> \n", df)

            class_report = classification_report(Y_test, y_pred)
            print(class_report)
            print(type(class_report))

            print("class_report ->\n " ,class_report)
            # class_report = class_report.to_csv()

            # score_data = json.dumps({'accuracy': accuracy, 'conf_mat': conf_mat, 'class_report': class_report})
            score = [["Accuracy", accuracy] ,
                    ["Confusion Matrix:", df],
                    ["Classification Report:", class_report]]

            # df = df.to_csv()

            return Response(score)

        else:
            sil_score = silhouette_score(X, y_pred)
            ch_score = calinski_harabasz_score(X, y_pred)
            db_score = davies_bouldin_score(X,y_pred)
            ri = rand_score(y, y_pred)
            ari = adjusted_rand_score(y, y_pred)

            score = [["Silhouette Score", sil_score] ,
                    ["Calinski Harabasz Score", ch_score],
                    ["Davies Bouldin Score", db_score],
                    ["Rand Score", ri],
                    ["Adjusted Rand Score", ari]]

            df = pd.DataFrame(score, columns=['Properties', 'Score'])
            df = df.to_csv()
            return Response(df)

        
@api_view(['POST', 'GET'])
def downloadModel(request):
    if(request.method == 'POST'):
        global model
        filepath = 'static/ModelFiles/model.joblib'
        joblib.dump(model, filepath)

        response = FileResponse(open(filepath, 'rb'))
        return response
    else:
        # Handle file not found error
        return HttpResponse("File not found.")
        