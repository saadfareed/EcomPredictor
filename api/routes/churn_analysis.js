const express = require("express");
const router = express.Router();
const auth=require('../../validation/auth')
let p = require('python-shell');
const Customer = require('../../Models/Customer');
const Record = require('../../Models/Record');
var cors = require('cors');
var app = express();
app.use(cors());
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.use(cookieParser());

//view details of churn analysis
router.get('/view',auth, function(req, res) {
  
   const userId=res.userId

    Customer.findOne({_id:userId})
    .then( data=>{
        if( data ){
            let value=data.SelectedAction.CA;
            let executed= data.SelectedAction.CAexecuted;
            let error=data.SelectedAction.CAerror
            Record.findOne({Customer:userId})
            .then(data1=>{
                if(data1){
                    res.send({
                        value: value,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        record:data1.CA,
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
            Customer.updateOne({_id:userId},{'SelectedAction.CA': true},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Churn Analysis added",
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
            Customer.updateOne({_id:userId},{'SelectedAction.CA': false},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "Churn Analysis removed",
                added: false,
            });

        }
        });

});

router.get('/churn',auth, function(req, res) {
    
    const userId=res.userId
    //console.log(userId)
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){
            let isDataUpload = data.DataUploaded;
            if(isDataUpload === true){
                if(data.SelectedAction.CA){
                    ca_var = true; 
                  
                    let pyshell = new p.PythonShell('./python_scripts/churnAnalysis.py');
                    pyshell.on('message', function (message) {
                        console.log(message); 
                    });
                    pyshell.end(function (err,code,signal) {
                        if (err) throw err;
                        Customer.updateOne({_id:userId},{ 'SelectedAction.CAexecuted': true ,'SelectedAction.CA': false},function(err, res) {
                            if (err) {
                                throw err
                                console.log(err);
                            }
                            Action.updateOne({},{ $inc: { 'ChurnAnalysis.Count': 1}},function(err, res) {
                                if (err) {
                                  throw err
                                  console.log(err);
                                }
                                
                               
                              })
                               
                        });
                        res.status(200).send("ok")
                       
                          
                        

                        });
                        
                }
                else{
                    res.status(200).send("ok")

                }


            }
            else{
                    res.send({
                        isDataUpload: false
                    });
            }
        }
        else{
            res.status(200).send("ok")

        }
       
    })
    .catch(function (error) {
        res.status(400).send("error")
        
      });
    

})

//download churn file

router.get('/download',function(req, res){
    const token=req.cookies['token']
    var decoded = jwt.verify(token, 'jwtPrivateKey');
    return res.download( `./excel_files/${decoded._id}/churn.csv` );
})




module.exports = router;




