#columns required
#'customerid', 'invoicedate', 'quantity', 'unitprice'

import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

import plotly.offline as pyoff
import plotly.graph_objs as go
import sys 
import os

lines = sys.stdin.readlines()
filename=lines[0]
filename= filename.rstrip(os.linesep)

#read excel file in df
df = pd.read_csv(f"./public/{filename}.csv", encoding="ISO-8859-1")
df.columns = map(str.lower, df.columns)

try:
    df = df[['customerid', 'invoicedate', 'quantity', 'unitprice']]
except KeyError as err:
    print("Key error: {0}".format(err))
    exit()


#print(df)

#----------------------------------Calculate Recency-------------------------------------

#change format of date time according to python scripts like year-month-day hour-minute-seconds
df['invoicedate'] = pd.to_datetime(df['invoicedate'])

#print(df['invoicedate'])

#make a new dataframe of customers unique ids
user_unique_id = pd.DataFrame(df['customerid'].unique())
user_unique_id.columns = ['customerid']

#print(customer_id['customerid'])

#get date of recent purchase of every customer and make new dafaframe with customer id plus recent purchase date
recent_purchase = df.groupby('customerid').invoicedate.max().reset_index()
recent_purchase.columns = ['customerid', 'RecentPurchaseDate']

#print(recent_purchase['RecentPurchaseDate'].max())
#print(recent_purchase['RecentPurchaseDate'])
#print((recent_purchase['RecentPurchaseDate'].max()-recent_purchase['RecentPurchaseDate']).dt.days)

#make a new column in recent_purchase days(score)
recent_purchase['Recency'] = (recent_purchase['RecentPurchaseDate'].max() - recent_purchase['RecentPurchaseDate']).dt.days

#attach these scores to customer unique ids
user_unique_id = pd.merge(user_unique_id, recent_purchase[['customerid', 'Recency']], on='customerid')

#print(user_unique_id)

#retunr top 5 rows
#print(user_unique_id.head())

#print(user_unique_id)

plot_data = [
    go.Histogram(
        x=user_unique_id['Recency']
    )
]

plot_layout = go.Layout(
        title='Histogram: Frequency(On Vertical Axis) vs Recency Score(On Horizontal Axis)'
)
fig = go.Figure(data=plot_data, layout=plot_layout)
#pyoff.plot(fig)

#print(sum(user_unique_id.Recency))

#print(user_unique_id.head())

#print(user_unique_id.Recency.describe())


#how many clusters are required
sse = {}
tx_recency = user_unique_id[['Recency']]
for k in range(1, 8):
    kmeans = KMeans(n_clusters=k, max_iter=1000).fit(tx_recency)
    #tx_recency["clusters"] = kmeans.labels_
    sse[k] = kmeans.inertia_
plt.figure()
plt.plot(list(sse.keys()), list(sse.values()))
plt.xlabel("Number of cluster")
plt.ylabel("Within cluster sum of squares distances")
#plt.show()

#build 4 clusters for recency and add it to dataframe
kmeans = KMeans(n_clusters=4)
kmeans.fit(user_unique_id[['Recency']])
user_unique_id['RecencyCluster'] = kmeans.predict(user_unique_id[['Recency']])

#print(user_unique_id['RecencyCluster'].describe())

#function for ordering cluster numbers


#print(user_unique_id.groupby('RecencyCluster')['Recency'].describe())


def order_cluster(cluster_field_name, target_field_name, df, ascending):
    new_cluster_field_name = 'new_' + cluster_field_name
    df_new = df.groupby(cluster_field_name)[target_field_name].mean().reset_index()
    df_new = df_new.sort_values(by=target_field_name, ascending=ascending).reset_index(drop=True)
    df_new['index'] = df_new.index
    df_final = pd.merge(df, df_new[[cluster_field_name, 'index']], on=cluster_field_name)
    df_final = df_final.drop([cluster_field_name], axis=1)
    df_final = df_final.rename(columns={"index": cluster_field_name})
    return df_final


user_unique_id = order_cluster('RecencyCluster', 'Recency', user_unique_id, False)

#print(user_unique_id.groupby('RecencyCluster')['Recency'].describe())

#---------------------------------Frequency--------------------------------------------

user_frequency = df.groupby('customerid').invoicedate.count().reset_index()
user_frequency.columns = ['customerid', 'Frequency']

#add this data to our main dataframe
user_unique_id = pd.merge(user_unique_id, user_frequency, on='customerid')

#plot the histogram
plot_data = [
    go.Histogram(
        x=user_unique_id.query('Frequency < 1000')['Frequency']
    )
]

plot_layout = go.Layout(
        title='Histogram: Frequency(On Vertical Axis) vs Frequency Score(On Horizontal Axis)'
    )
fig = go.Figure(data=plot_data, layout=plot_layout)
#pyoff.plot(fig)

#print(user_unique_id)

#k-means
kmeans = KMeans(n_clusters=4)
kmeans.fit(user_unique_id[['Frequency']])
user_unique_id['FrequencyCluster'] = kmeans.predict(user_unique_id[['Frequency']])

#order the frequency cluster
user_unique_id = order_cluster('FrequencyCluster', 'Frequency', user_unique_id, True)

#see details of each cluster
#print(user_unique_id.groupby('FrequencyCluster')['Frequency'].describe())

#---------------------Monetary-----------------------------------------------------------

#calculate revenue for each customer
df['Revenue'] = df['unitprice'] * df['quantity']
user_revenue = df.groupby('customerid').Revenue.sum().reset_index()

#merge it with our main dataframe
user_unique_id = pd.merge(user_unique_id, user_revenue, on='customerid')

#plot the histogram
plot_data = [
    go.Histogram(
        x=user_unique_id.query('Revenue < 10000')['Revenue']
    )
]

plot_layout = go.Layout(
        title='Histogram: Frequency(On Vertical Axis) vs Monetary Score(On Horizontal Axis)'
    )
fig = go.Figure(data=plot_data, layout=plot_layout)
#pyoff.plot(fig)

#apply clustering
kmeans = KMeans(n_clusters=4)
kmeans.fit(user_unique_id[['Revenue']])
user_unique_id['RevenueCluster'] = kmeans.predict(user_unique_id[['Revenue']])


#order the cluster numbers
user_unique_id = order_cluster('RevenueCluster', 'Revenue', user_unique_id, True)

#show details of the dataframe
#print(user_unique_id.groupby('RevenueCluster')['Revenue'].describe())



#----------------------------------------Final result--------------------------------------------------------

#calculate overall score and use mean() to see details
user_unique_id['OverallScore'] = user_unique_id['RecencyCluster'] + user_unique_id['FrequencyCluster'] + user_unique_id['RevenueCluster']
#print(user_unique_id)
#print(user_unique_id.groupby('OverallScore')['Recency', 'Frequency', 'Revenue'].mean())

user_unique_id['Segment'] = 'Low-Value'
user_unique_id.loc[user_unique_id['OverallScore']>2,'Segment'] = 'Mid-Value'
user_unique_id.loc[user_unique_id['OverallScore']>4,'Segment'] = 'High-Value'

#download file
user_unique_id.to_excel(f'./excel_files/{filename}/custSeg.xlsx')

#Revenue vs Frequency
tx_graph = user_unique_id.query("Revenue < 50000 and Frequency < 2000")

plot_data = [
    go.Scatter(
        y=tx_graph.query("Segment == 'Low-Value'")['Frequency'],
        x=tx_graph.query("Segment == 'Low-Value'")['Revenue'],
        mode='markers',
        name='Low',
        marker= dict(size= 7,
            line= dict(width=1),
            color= 'blue',
            opacity= 0.8
           )
    ),
        go.Scatter(
        y=tx_graph.query("Segment == 'Mid-Value'")['Frequency'],
        x=tx_graph.query("Segment == 'Mid-Value'")['Revenue'],
        mode='markers',
        name='Mid',
        marker= dict(size= 9,
            line= dict(width=1),
            color= 'green',
            opacity= 0.5
           )
    ),
        go.Scatter(
        y=tx_graph.query("Segment == 'High-Value'")['Frequency'],
        x=tx_graph.query("Segment == 'High-Value'")['Revenue'],
        mode='markers',
        name='High',
        marker= dict(size= 11,
            line= dict(width=1),
            color= 'red',
            opacity= 0.9
           )
    ),
]

plot_layout = go.Layout(
        xaxis= {'title': "Revenue"},
        yaxis= {'title': "Frequency"},
        title='Segments:  Frequency vs Revenue'
    )
fig = go.Figure(data=plot_data, layout=plot_layout)
#pyoff.plot(fig)


#Revenue vs Recency

tx_graph = user_unique_id.query("Revenue < 50000 and Frequency < 2000")

plot_data = [
    go.Scatter(
        x=tx_graph.query("Segment == 'Low-Value'")['Recency'],
        y=tx_graph.query("Segment == 'Low-Value'")['Revenue'],
        mode='markers',
        name='Low',
        marker= dict(size= 7,
            line= dict(width=1),
            color= 'blue',
            opacity= 0.8
           )
    ),
        go.Scatter(
        x=tx_graph.query("Segment == 'Mid-Value'")['Recency'],
        y=tx_graph.query("Segment == 'Mid-Value'")['Revenue'],
        mode='markers',
        name='Mid',
        marker= dict(size= 9,
            line= dict(width=1),
            color= 'green',
            opacity= 0.5
           )
    ),
        go.Scatter(
        x=tx_graph.query("Segment == 'High-Value'")['Recency'],
        y=tx_graph.query("Segment == 'High-Value'")['Revenue'],
        mode='markers',
        name='High',
        marker= dict(size= 11,
            line= dict(width=1),
            color= 'red',
            opacity= 0.9
           )
    ),
]

plot_layout = go.Layout(
        yaxis= {'title': "Revenue"},
        xaxis= {'title': "Recency"},
        title='Segments: Revenue vs Recency'
    )
fig = go.Figure(data=plot_data, layout=plot_layout)
#pyoff.plot(fig)


# Revenue vs Frequency
tx_graph = user_unique_id.query("Revenue < 50000 and Frequency < 2000")

plot_data = [
    go.Scatter(
        x=tx_graph.query("Segment == 'Low-Value'")['Recency'],
        y=tx_graph.query("Segment == 'Low-Value'")['Frequency'],
        mode='markers',
        name='Low',
        marker= dict(size= 7,
            line= dict(width=1),
            color= 'blue',
            opacity= 0.8
           )
    ),
        go.Scatter(
        x=tx_graph.query("Segment == 'Mid-Value'")['Recency'],
        y=tx_graph.query("Segment == 'Mid-Value'")['Frequency'],
        mode='markers',
        name='Mid',
        marker= dict(size= 9,
            line= dict(width=1),
            color= 'green',
            opacity= 0.5
           )
    ),
        go.Scatter(
        x=tx_graph.query("Segment == 'High-Value'")['Recency'],
        y=tx_graph.query("Segment == 'High-Value'")['Frequency'],
        mode='markers',
        name='High',
        marker= dict(size= 11,
            line= dict(width=1),
            color= 'red',
            opacity= 0.9
           )
    ),
]

plot_layout = go.Layout(
        yaxis= {'title': "Frequency"},
        xaxis= {'title': "Recency"},
        title='Segments: Frequency vs Recency'
    )
fig = go.Figure(data=plot_data, layout=plot_layout)
#pyoff.plot(fig)
print("RFM executed sucessfully")