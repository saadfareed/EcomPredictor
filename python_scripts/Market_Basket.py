from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth
import matplotlib.pyplot as plt
import pandas as pd
import sys 
import os

lines = sys.stdin.readlines()
filename=lines[0]
filename= filename.rstrip(os.linesep)

df = pd.read_csv(f"./public/{filename}.csv", encoding="ISO-8859-1")

'''converting all column names to lower case'''
df.columns = map(str.lower, df.columns)

'''checking if churn or customerid is in file, if not then end the program'''
try:

    Xdf = df[['invoiceno', 'description', 'quantity', 'invoicedate', 'customerid', 'unitprice']]
except KeyError as err:
    print("Key error: {0}".format(err))
    exit()


df.drop_duplicates(subset=['invoiceno', 'description', 'quantity', 'invoicedate', 'customerid', 'unitprice', 'country'], keep='first', inplace=True)



if '/' in df['invoicedate']:
    df['invoicedate'] = pd.to_datetime(df.invoicedate, errors='coerce')
    df['invoicedate'] = df['invoicedate'].dt.strftime('%e -%m -%Y')
else:
    df['invoicedate'] = pd.to_datetime(df.invoicedate, errors='coerce')
    df['invoicedate'] = df['invoicedate'].dt.strftime('%m -%e -%Y')

unique_items = df['description'].unique()
unique_items = unique_items.tolist()
#print(unique_items)

temp=str(df['invoiceno'][0])
#print(temp)

tid = list()
temp_tid = list()
for index, rows in df.iterrows():
    if temp == rows['invoiceno']:
        temp_tid.append(unique_items.index(rows['description']))
    else:
        temp_tid.sort()
        tid.append(temp_tid)#append transaction to transactions list
        temp_tid = list()
        temp = str(rows['invoiceno'])
        temp_tid.append(unique_items.index(rows['description']))

#print(tid)

sys.setrecursionlimit(25000)

te = TransactionEncoder()
te_ary = te.fit(tid).transform(tid)
df = pd.DataFrame(te_ary, columns=te.columns_)
frequent_itemsets = fpgrowth(df, min_support=0.01, use_colnames=True)
#print("frequent items")
#print(frequent_itemsets)

frequent_itemsets['itemsets']= [list(x) for x in frequent_itemsets['itemsets']]

itemslist=list()
for index, rows in frequent_itemsets.iterrows():
    il=list()
    for f in range(len(rows['itemsets'])):
        il.append(unique_items[rows['itemsets'][f]])
    itemslist.append(il)

frequent_itemsets['itemsets']=itemslist
frequent_itemsets.to_excel(f'./excel_files/{filename}/FPgrowth.xlsx')
print('Market Basket Executed')
