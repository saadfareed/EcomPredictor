const express = require("express");
const router = express.Router();
const auth=require('../../validation/auth')
let p = require('python-shell');
// const Customer = require("C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\Models\\Customer.js");
const Customer = require('../../Models/Customer');
const Record = require('../../Models/Record');

var cors = require('cors');
var app = express();
app.use(cors());
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.use(cookieParser());

//return detail of market basket
router.get('/view',auth, function(req, res) {
   
   const userId=res.userId

    Customer.findOne({_id:userId})
    .then( data=>{
        if( data ){
            let value=data.SelectedAction.MarketBasket;
            let executed= data.SelectedAction.MBexecuted;
            let error=data.SelectedAction.MBerror
            Record.findOne({Customer:userId})
            .then(data1=>{
                if(data1){
                    res.send({
                        value: value,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        record:data1.MB,
                        error:error
                    });
                    

                }
                else{
                    res.send({
                        value: value ,
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
            Customer.updateOne({_id:userId},{'SelectedAction.MarketBasket': true},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Market Basket added",
                added: true,
            });

        }
        });

});


//remove from selected actions
router.post('/remove',auth, function(req, res) {
    const userId=res.userId

    //const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

            console.log(data.DataUploaded)
            Customer.updateOne({_id:userId},{'SelectedAction.MarketBasket': false},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Market Basket removed",
                added: false,
            });

        }
        });

});

router.get('/download',function(req, res){
    const token=req.cookies['token']
    var decoded = jwt.verify(token, 'jwtPrivateKey');
    return res.download( `./excel_files/${decoded._id}/FPgrowth.xlsx` );
})




module.exports = router;




