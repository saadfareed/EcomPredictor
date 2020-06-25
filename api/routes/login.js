
const Customer=require('../../Models/Customer')
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs')
const validateloginInput=require('../../validation/validateCustomerlogin.js')
var jwt = require('jsonwebtoken');
const auth=require('../../validation/auth')

// check object is empty or not
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;

          
  }
  return true;
}

//user login
router.post('/',(req,res)=>{  
  


    const customer=new Customer({
        
      Email:req.body.email,
      Password:req.body.password
      
      })
      let data;
      async function validate(){
         data= await validateloginInput(customer)  
        
      }
      validate().then(()=>{
        
        if(!isEmpty(data[0])) {
          res.send({
            errors:data[0]
          })    
      
        }
        else{
          
          res.send({
            token:data[1]
          }) 
          
        }
        
      })
      
  
  });


  module.exports =router;