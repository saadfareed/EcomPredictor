var jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const auth=require('../../validation/auth')

// const Customer = require("C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\Models\\Customer.js");
const Customer = require('../../Models/Customer');
const Record = require('../../Models/Record');

var cors = require('cors');
var app = express();
app.use(cors());


//view detail
router.get('/view',auth, function(req, res) {
   // const email = "Hamzakhan003@gmail.com";
   const userId=res.userId

    Customer.findOne({_id:userId})
    .then( data=>{
        if( data ){
            let value=data.SelectedAction.UL;
            let executed= data.SelectedAction.ULexecuted;
            let error=data.SelectedAction.ULerror
            Record.findOne({Customer:userId})
            .then(data1=>{
                if(data1){
                    res.send({
                        value: value,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        record:data1.UL,
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

//downlaod file
router.get('/download',function(req, res){
    //return res.download( './excel_files/FPgrowth.xlsx' );
    const token=req.cookies['token']
    var decoded = jwt.verify(token, 'jwtPrivateKey');
    return res.download( `./excel_files/${decoded._id}/UpliftModeling.xlsx` );
})
//add in selected actions

router.post('/add',auth, function(req, res) {
    const userId=res.userId

    //const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

            console.log(data.DataUploaded)
            Customer.updateOne({_id:userId},{'SelectedAction.UL': true},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Uplift Modelling added",
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
            Customer.updateOne({_id:userId},{'SelectedAction.UL': false},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Uplift Modelling removed",
                added: false,
            });

        }
        });

});



module.exports = router;




