const Customer=require('../../Models/Customer')
const Record=require('../../Models/Record')
const express=require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth=require('../../validation/auth')

// refresh account details
router.get('/',auth,(req,res)=>{ 
    const userId=res.userId
          Customer.findOne({_id:userId})
          .then(data=>{
            if(data){

                Customer.updateOne({_id:userId},{'SelectedAction.RFM': false,'SelectedAction.RFMexecuted': false,'SelectedAction.RFMerror': false,'SelectedAction.Salesforecasting': false,'SelectedAction.SFexecuted': false,'SelectedAction.SFerror': false,'SelectedAction.MarketBasket': false,'SelectedAction.MBexecuted': false,'SelectedAction.MBerror': false,'SelectedAction.LTV': false,'SelectedAction.LTVexecuted': false,'SelectedAction.LTVerror': false,'SelectedAction.CA': false,'SelectedAction.CAexecuted': false,'SelectedAction.CAerror': false,'SelectedAction.MR': false,'SelectedAction.MRexecuted': false,'SelectedAction.MRerror': false,'SelectedAction.UL': false,'SelectedAction.ULexecuted': false,'SelectedAction.ULerror': false,DataUploaded:false},function(err, res) {
                    if (err) {
                        throw err
                        console.log(err);
                    }   
                });
               Record.deleteOne({Customer:userId},function (err) {
                if(err) console.log(err);
                console.log("Successful deletion");
                })
                res.status(200).send()
        
             
  
            }
            else{
                
              res.status(401).send()
             
       
            }
          })
  
  
  });
  


  


  module.exports =router;