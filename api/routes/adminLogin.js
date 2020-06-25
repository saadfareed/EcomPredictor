
const Admin=require('../../Models/Admin')
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs')
const validateAdminloginInput=require('../../validation/validateAdminlogin.js')
var jwt = require('jsonwebtoken');
const auth=require('../../validation/auth')

//checks object is empty or not
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
//admin sign sign up
router.post('/register',(req,res)=>{
     
    const admin=new Admin({
      
      Email:req.body.email,
      Password:req.body.password
      
    })
    //bcrypt password
    async function validate(){
       
        const salt=await bcrypt.genSalt(10);
        admin.Password=await bcrypt.hash(admin.Password,salt)
        
    }
     validate().then(()=>{
     admin.save()
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
        })
     
      
     
  });
  
//admin login
router.post('/',(req,res)=>{  
  

    const admin=new Admin({
        
      Email:req.body.email,
      Password:req.body.password
      
      })
      let data;
      async function validate(){
         data= await validateAdminloginInput(admin)  
        
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