#columns required
#'history', 'offer', 'conversion'

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import plotly.offline as pyoff
import plotly.graph_objs as go
from datetime import datetime, timedelta,date
from sklearn.metrics import classification_report,confusion_matrix
import xgboost as xgb
import sys 
import os

lines = sys.stdin.readlines()
filename=lines[0]
filename= filename.rstrip(os.linesep)

def order_cluster(cluster_field_name, target_field_name, df, ascending):
    new_cluster_field_name = 'new_' + cluster_field_name
    df_new = df.groupby(cluster_field_name)[target_field_name].mean().reset_index()
    df_new = df_new.sort_values(by=target_field_name, ascending=ascending).reset_index(drop=True)
    df_new['index'] = df_new.index
    df_final = pd.merge(df, df_new[[cluster_field_name, 'index']], on=cluster_field_name)
    df_final = df_final.drop([cluster_field_name], axis=1)
    df_final = df_final.rename(columns={"index": cluster_field_name})
    return df_final


# function for calculating the uplift
def calc_uplift(df):
    avg_order_value = 25

    # calculate conversions for each offer type
    base_conv = df[df.offer == 'No Offer']['conversion'].mean()
    disc_conv = df[df.offer == 'Discount']['conversion'].mean()
    bogo_conv = df[df.offer == 'Buy One Get One']['conversion'].mean()

    # calculate conversion uplift for discount and bogo
    disc_conv_uplift = disc_conv - base_conv
    bogo_conv_uplift = bogo_conv - base_conv

    # calculate order uplift
    disc_order_uplift = disc_conv_uplift * len(df[df.offer == 'Discount']['conversion'])
    bogo_order_uplift = bogo_conv_uplift * len(df[df.offer == 'Buy One Get One']['conversion'])

    # calculate revenue uplift
    disc_rev_uplift = disc_order_uplift * avg_order_value
    bogo_rev_uplift = bogo_order_uplift * avg_order_value

    print('Total Targeted Customer Count: {0}'.format(len(df[df.offer == 'Discount'])))
    print('Discount Conversion Uplift: {0}%'.format(np.round(disc_conv_uplift * 100, 2)))
    print('Discount Order Uplift: {0}'.format(np.round(disc_order_uplift, 2)))
    print('Discount Revenue Uplift: ${0}'.format(np.round(disc_rev_uplift, 2)))
    print('Revenue Uplift Per Targeted Customer: ${0}\n'.format(np.round(disc_rev_uplift, 2)/len(df[df.offer == 'Discount'])))

    if len(df[df.offer == 'Buy One Get One']['conversion']) > 0:
        print('Total Targeted Customer Count: {0}'.format(len(df[df.offer == 'Buy One Get One'])))
        print('BOGO Conversion Uplift: {0}%'.format(np.round(bogo_conv_uplift * 100, 2)))
        print('BOGO Order Uplift: {0}'.format(np.round(bogo_order_uplift, 2)))
        print('BOGO Revenue Uplift: ${0}'.format(np.round(bogo_rev_uplift, 2)))
        print('Revenue Uplift Per Targeted Customer: ${0}\n'.format(np.round(disc_rev_uplift, 2)/len(df[df.offer == 'Buy One Get One'])))

#wa
df = pd.read_csv(f"./public/{filename}.csv", encoding="ISO-8859-1")
df.columns = map(str.lower, df.columns)

try:
    df = df[['history', 'offer', 'conversion']]
except KeyError as err:
    print("Key error: {0}".format(err))
    exit()

#print(df)
#print(df.head())

#calc_uplift(df)

df['campaign_group'] = 'treatment'
df.loc[df.offer == 'No Offer', 'campaign_group'] = 'control'

df['target_class'] = 0  #CN
df.loc[(df.campaign_group == 'control') & (df.conversion > 0), 'target_class'] = 1  #CR
df.loc[(df.campaign_group == 'treatment') & (df.conversion == 0), 'target_class'] = 2  #TN
df.loc[(df.campaign_group == 'treatment') & (df.conversion > 0), 'target_class'] = 3  #TR

#creating the clusters
kmeans = KMeans(n_clusters=5)
kmeans.fit(df[['history']])
df['history_cluster'] = kmeans.predict(df[['history']])
#order the clusters
df = order_cluster('history_cluster', 'history', df, True)
#creating a new dataframe as model and dropping columns that defines the label
df_model = df.drop(['offer', 'campaign_group', 'conversion'], axis=1)
#convert categorical columns
df_model = pd.get_dummies(df_model)

#create feature set and labels
X = df_model.drop(['target_class'], axis=1)
y = df_model.target_class
#splitting train and test groups
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.05, random_state=56)
#fitting the model and predicting the probabilities
xgb_model = xgb.XGBClassifier().fit(X_train, y_train)
class_probs = xgb_model.predict_proba(X_test)

#print(class_probs[0])


#probabilities for all customers
overall_proba = xgb_model.predict_proba(df_model.drop(['target_class'], axis=1))
#assign probabilities to 4 different columns
df_model['proba_CN'] = overall_proba[:, 0]
df_model['proba_CR'] = overall_proba[:, 1]
df_model['proba_TN'] = overall_proba[:, 2]
df_model['proba_TR'] = overall_proba[:, 3]
#calculate uplift score for all customers
df_model['uplift_score'] = df_model.eval('proba_CN + proba_TR - proba_TN - proba_CR')
#assign it back to main dataframe
df['uplift_score'] = df_model['uplift_score']

#We target customers below, who have uplift score greater than 3rd quantile
df_data_lift = df.copy()
uplift_q_75 = df_data_lift.uplift_score.quantile(0.75)
#print(df_data_lift)
#download file

df_data_lift.to_excel(f'./excel_files/{filename}/UpliftModeling.xlsx')
df_data_lift = df_data_lift[(df_data_lift.offer != 'Buy One Get One') & (df_data_lift.uplift_score > uplift_q_75)].reset_index(drop=True)
#print(df_data_lift)
#calculate the uplift
calc_uplift(df_data_lift)
#print('Revenue Uplift Per Targeted Customer:', 34608/len(df_data_lift))


df_data_lift = df.copy()
uplift_q_5 = df_data_lift.uplift_score.quantile(0.5)
df_data_lift = df_data_lift[(df_data_lift.offer != 'Buy One Get One') & (df_data_lift.uplift_score < uplift_q_5)].reset_index(drop=True)
#calculate the uplift
#calc_uplift(df_data_lift)
#print('Revenue Uplift Per Targeted Customer:', 34608/len(df_data_lift))