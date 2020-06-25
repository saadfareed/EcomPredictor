const express = require("express");
const router = express.Router();
const auth=require('../../validation/auth')

// const Customer = require("C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\Models\\Customer.js");
const Customer = require('../../Models/Customer');
const Record = require('../../Models/Record');
const xlsx=require('xlsx')
var cors = require('cors');
var app = express();
app.use(cors());
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.use(cookieParser());

//view detail 
router.get('/view',auth, function(req, res) {
   // const email = "Hamzakhan003@gmail.com";
   const userId=res.userId

    Customer.findOne({_id:userId})
    .then( data=>{
        if( data ){
            let value=data.SelectedAction.LTV;
            let executed= data.SelectedAction.LTVexecuted;
            let error=data.SelectedAction.LTVerror
            Record.findOne({Customer:userId})
            .then(data1=>{
                if(data1){
                    res.send({
                        value: value,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        record:data1.LTV,
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
            Customer.updateOne({_id:userId},{'SelectedAction.LTV': true},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Lifetime Value Modelling added",
                added: true,
            });

        }
        });

});


//remove from selected action
router.post('/remove',auth, function(req, res) {
    const userId=res.userId

    //const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

            console.log(data.DataUploaded)
            Customer.updateOne({_id:userId},{'SelectedAction.LTV': false},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Lifetime Value Modelling removed",
                added: false,
            });

        }
        });

});
//download
router.get('/download',function(req, res){
    const token=req.cookies['token']
    var decoded = jwt.verify(token, 'jwtPrivateKey');
    return res.download( `./excel_files/${decoded._id}/LTV.xlsx` );
})

//plot graph
router.get('/plot-graph',auth, function(req, res) {
    const userId=res.userId
    const w=xlsx.readFile(`./excel_files/${userId}/LTV.xlsx`)
    const s=w.SheetNames;
    let data1=xlsx.utils.sheet_to_json(w.Sheets[s[0]])
    const data=[0,0,0]


data1.map(n=>{
    
   
    if(n.LTVSegment=="Low-Value"){
        data[0]++;
      
    }
    if(n.LTVSegment=="Mid-Value"){
        data[1]++;
    }
    if(n.LTVSegment=="High-Value"){
        data[2]++;
    }

    
})
res.send({
    val:data,
    
})


})




module.exports = router;




