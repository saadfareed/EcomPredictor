
const Customer=require('../../Models/Customer')
const express=require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail=require('./email')

//reset password
router.post('/reset',(req,res)=>{ 
          Customer.findOne({Email:req.body.femail})
     
          .then(data=>{
            if(data){
                sendEmail(data.Email,data._id, data.Firstname).then(a=>{
                    if(a[0]==true){
                      Customer.updateOne({Email:data.Email},{token: a[1]},function(err, res) {
                        if (err) {
                            throw err
                            console.log(err);
                        }   
                      });
                    
                      res.send({
                        check:true
                     })
      
                    }
                    else if(a[0]==false){
                      res.send({
                        check:false
                     })
                    }
                   
                  })
              
              
              
              
             
  
            }
            else{
                
              res.status(200).send({check:false})
             
       
            }
          })
  
  
  });
  

//update password
  router.post('/updatePassword',function(req, res){
 
    
    Customer.findOne({ _id: req.body.id }, function (errorFind, userData) {
        if(userData.token==req.body.linkDate && req.body.password==req.body.confirm_password)
        {
          
            bcrypt.genSalt(10, (errB, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    let newPassword = hash;
                    Customer.updateOne({_id:userData._id},{Password:newPassword},function(err, res) {
                      if (err) {
                          throw err
                          console.log(err);
                      }
                     
                     });
                    
                     return res.status(200).json({
                      success: true,
                      msg: "Your password are Successfully Updated",
                    
                     }); 
                    
                });
            });
        }
        if (errorFind)
        {
                return res.status(401).json({
                msg: "Something Went Wrong",
                success: false
            });
        }
    }
    );
   
})


  module.exports =router;