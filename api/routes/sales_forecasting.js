const express = require("express");
const router = express.Router();
//const Customer = require("C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\Models\\Customer.js");
const Customer = require('../../Models/Customer');
const Record = require('../../Models/Record');
var cors = require('cors');
const auth=require('../../validation/auth')
var app = express();
const xlsx=require('xlsx')
let p = require('python-shell');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.use(cookieParser());


app.use(cors());

//view detail 
router.get('/view',auth, function(req, res) {
    const userId=res.userId
    
   // const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){
            let salevalue=data.SelectedAction.Salesforecasting;
            let executed= data.SelectedAction.SFexecuted;
            let error=data.SelectedAction.SFerror
            Record.findOne({Customer:userId})
            .then(data1=>{
                if(data1){
                    res.send({
                        value: salevalue,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        record:data1.SF,
                        error:error
                    });
                    

                }
                else{
                    res.send({
                        value: salevalue ,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        error:error,
                    });

                }

            })
       
    }
    });
});


//add in selected action
router.post('/add',auth, function(req, res) {
    const userId=res.userId

    //const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

            console.log(data.DataUploaded)
            Customer.updateOne({_id:userId},{ 'SelectedAction.Salesforecasting':true},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Sales Forecast added",
                added: true,
            });

        }
        });

});

//remove from selected action
router.post('/remove',auth, function(req, res) {
    const userId=res.userId

   // const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

            console.log(data.DataUploaded)
            Customer.updateOne({_id:userId},{'SelectedAction.Salesforecasting':false},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Sales Forecast remove",
                added: false,
            });

        }
        });

});

//plot graph
router.get('/plot-graph',auth, function(req, res) {
    const userId=res.userId
    
    //const w=xlsx.readFile('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\excel_files\\ARIMA.xlsx')
    //const w=xlsx.readFile('D:\\ecom-predictor\\backend\\excel_files\\ARIMA.xlsx')
    const w=xlsx.readFile(`./excel_files/${userId}/ARIMA.xlsx`)
    const s=w.SheetNames;
    let data=xlsx.utils.sheet_to_json(w.Sheets[s[0]])
    const chartData={

        labels:[],
        datasets:[]
    
    }
    data.map(n=>{
        chartData.labels.push(n.invoicedate)
        chartData.datasets.push(n.unitprice)
    })

    res.send({
        val:chartData
    });
});

//downlapd file
var fs = require('fs');
router.get('/download',function(req, res){
    const token=req.cookies['token']
    var decoded = jwt.verify(token, 'jwtPrivateKey');
    return res.download( `./excel_files/${decoded._id}/ARIMA.xlsx` );
})



module.exports = router;

