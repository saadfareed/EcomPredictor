import pandas as pd

import sys 
import os

lines = sys.stdin.readlines()
filename=lines[0]
filename= filename.rstrip(os.linesep)



#reading csv into dataframe
df = pd.read_csv(f"./public/{filename}.csv", encoding="ISO-8859-1")

'''converting all column names to lower case'''
df.columns = map(str.lower, df.columns)

try:
    Xdf = df[['invoiceno', 'description', 'quantity', 'invoicedate', 'customerid', 'unitprice', 'country']]
except KeyError as err:
    print("Key error: {0}".format(err))
    exit()

#de_duplication
df.drop_duplicates(subset=['invoiceno', 'description', 'quantity', 'invoicedate', 'customerid', 'unitprice', 'country'], keep='first', inplace=True)

#date_format_standardization
if '/' in df['invoicedate']:
    df['invoicedate'] = pd.to_datetime(df.invoicedate, errors='coerce')
    df['invoicedate'] = df['invoicedate'].dt.strftime('%e -%m -%Y')
else:
    df['invoicedate'] = pd.to_datetime(df.invoicedate, errors='coerce')
    df['invoicedate'] = df['invoicedate'].dt.strftime('%m -%e -%Y')


#transaction wise data
new_df = df.groupby(['invoiceno', 'invoicedate', 'customerid', 'country'])['unitprice'].sum()
new_dff = new_df.to_frame()

#export_csv = new_dff.to_csv (r'D:\.Semester 7\FYP\FYP docx\data_updated.csv', header=True)
#new_dff

new_dff.to_excel(f'./excel_files/{filename}/ETL_results.xlsx')

#print(df.head)
print ('ETL Executed')

