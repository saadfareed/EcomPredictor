const Customer=require('../../Models/Customer')
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs')
const validatesignUpInput=require('../../validation/validateSignup.js')

var jwt = require('jsonwebtoken')

const auth=require('../../validation/authAdmin.js')


//check object is empty or not
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

//register user
router.post('/registor',(req,res)=>{
 
  
  const customer=new Customer({
    
    Email:req.body.email,
    Firstname:req.body.fname,
    Lastname:req.body.lname,
    Image:req.body.image,
    Plan:req.body.plan,
    Password:req.body.password
    
    })
    let errors;
    async function validate(){
       errors= await validatesignUpInput(customer)  
       const salt=await bcrypt.genSalt(10);
       customer.Password=await bcrypt.hash(customer.Password,salt)
       
    }
    
    validate().then(()=>{
      console.log(customer)
      if(isEmpty(errors)) {

        
        customer.save()
        .then(()=>{   
         
         res.send({
              message:'added'
          })
        })
        .catch((err)=>{
        
          res.send({
            message:'not added'
          })
         
        })
    
      }
      else{
        console.log("Message: Validation Failed by registor.")
        res.send({
          message:'not added',
          errors:errors
        })
      }
    })
   
    
   
});

//register user by admin
  router.post('/byadmin',auth,(req,res)=>{
    if(req.body.plan=="Free"){
      pay=0;
    }
    else if(req.body.plan=="Basic"){
      pay=50;
    }
    else if(req.body.plan=="Premium"){
      pay=100
    }
  
  
    const customer=new Customer({
    
      Email:req.body.email,
      Firstname:req.body.fname,
      Lastname:req.body.lname,
      Image:req.body.image,
      Plan:req.body.plan,
      Password:req.body.password,
      Pay:pay
      
    })
    let errors;
    async function validate(){
       errors= await validatesignUpInput(customer)  
       const salt=await bcrypt.genSalt(10);
       customer.Password=await bcrypt.hash(customer.Password,salt)
       
    }
    
    validate().then(()=>{
      console.log(errors)
      if(isEmpty(errors)) {

        
        customer.save()
        .then(()=>{   
         
         res.send({
              message:'added'
          })
        })
        .catch((err)=>{
        
          res.send({
            message:'not added'
          })
         
        })
    
      }
      else{
        console.log("Message: Validation Failed by admin.")
        res.send({
          message:'not added',
          errors:errors
        })
      }
    })
   
    
   
});


     
     
   
    
  
module.exports=router;