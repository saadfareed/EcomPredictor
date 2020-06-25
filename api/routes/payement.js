
const Customer=require('../../Models/Customer')
const auth=require('../../validation/auth')
const express=require('express');
const stripe=require("stripe")("sk_test_Iy6pidel2UOXkqB21r6LlKH700lo4cbZar")
const router=express.Router();
const uuid=require("uuid/v5")

//deduct amount from account
router.post("/",auth,(req,res)=>{
    let email;
    const userId=res.userId;
    const amount=req.body.amount;
   
    Customer.findOne({_id:userId})
    .then( data=>{
      if(data){
         
       
        email=data.Email
        if(amount==5000){
            let pay=data.Pay+50;

        
        validate().then(
            Customer.updateOne({_id:userId},{'Plan': "Basic",'Pay':pay})
            .then(res.status(200).send({
                check:true
            }) )
        
          
        )
        }
        else if(amount==10000){
            let pay=data.Pay+100;
            validate().then(
                Customer.updateOne({_id:userId},{'Plan': "Premium",'Pay':pay})
                .then(res.status(200).send({
                    check:true
                }) )
            
              
            )
        }
        
      }
  
    })
    .catch(err=>{
      res.status(400).send()
     })
   
    async function validate() {
       
        const charge = await stripe.charges.create({
         
          amount:amount,
          currency: 'usd',
          source: req.body.token.id,
          receipt_email: email,
          description: "Some description",
         
        });
    };
    
    
    
    
})

module.exports =router;