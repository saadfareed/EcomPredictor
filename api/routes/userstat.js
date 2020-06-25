const Customer=require('../../Models/Customer')
const Action=require('../../Models/Actions')
const auth=require('../../validation/auth')
const express=require('express');
const router=express.Router();

//check status
function enableordisable(data){
  
  let status=[]
  return new Promise((resolve,reject)=>{
  if(data.SalesForecasting.AbleorDisable==true){
    
    status[0]=true

  }
  else{
    
    status[0]=false
  }
  if(data.MarketBasket.AbleorDisable==true){
    
    status[1]=true

  }
  else{
    
    status[1]=false
  }
  if(data.RFM.AbleorDisable==true){
    
    status[2]=true

  }
  else{
    
    status[2]=false
  }
  if(data.ChurnAnalysis.AbleorDisable==true){
   
    status[3]=true

  }
  else{
   
    status[3]=false
  }
  if(data.LifeTimeModelling.AbleorDisable==true){
    
    status[4]=true

  }
  else{
    
    status[4]=false
  }
  if(data.MarketResponse.AbleorDisable==true){
   
    status[5]=true

  }
  else{
   
    status[5]=false
  }
  if(data.UpliftModelling.AbleorDisable==true){
    
    status[6]=true

  }
  else{
    
    status[6]=false
  }
  setTimeout(()=>{
            
    resolve(status)
  },2000)

})

}

//find user plan
router.get('/findplan',auth,(req,res)=>{  
    //console.log(req.headers.token)
    const userId=res.userId
   
    Customer.findOne({_id:userId})
    .then( data=>{
      if(data){
       
        res.send({
          plan:data.Plan
        })
      }
  
    })
    .catch(err=>{
      res.status(400).send()
     })
  
  })

  //find status
  router.get('/findenableordisable',auth,(req,res)=>{  
   
    const userId=res.userId
    
    let content;
    Action.findOne()
    .then(data=>{
       async function validate(){
        content= await enableordisable(data)
        
       
       }
      validate().then(()=>{
      
        res.send({
         
        checked:content,
         
  
        })
      
      })
  
    })
    
  
  
     
    
    });

  module.exports =router;
  