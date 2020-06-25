
const Admin=require('../../Models/Admin')
const Customer=require('../../Models/Customer')
const Action=require('../../Models/Actions')
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');
const auth=require('../../validation/authAdmin')

//count which prediction is enable or disable
function Countenableordisable(data){
  let enable=0;
  let disable=0;
  let status=[]
  return new Promise((resolve,reject)=>{
  if(data.SalesForecasting.AbleorDisable==true){
    enable++;
    status[0]=true

  }
  else{
    disable++;
    status[0]=false
  }
  if(data.MarketBasket.AbleorDisable==true){
    enable++;
    status[1]=true

  }
  else{
    disable++;
    status[1]=false
  }
  if(data.RFM.AbleorDisable==true){
    enable++;
    status[2]=true

  }
  else{
    disable++;
    status[2]=false
  }
  if(data.ChurnAnalysis.AbleorDisable==true){
    enable++;
    status[3]=true

  }
  else{
    disable++;
    status[3]=false
  }
  if(data.LifeTimeModelling.AbleorDisable==true){
    enable++;
    status[4]=true

  }
  else{
    disable++;
    status[4]=false
  }
  if(data.MarketResponse.AbleorDisable==true){
    enable++;
    status[5]=true

  }
  else{
    disable++;
    status[5]=false
  }
  if(data.UpliftModelling.AbleorDisable==true){
    enable++;
    status[6]=true

  }
  else{
    disable++;
    status[6]=false
  }
  setTimeout(()=>{
            
    resolve([enable,disable,status])
  },2000)

})

}

//count which predction is used most or least
function Countmostorleast(data){
  let most='';
  let least='';
  let content=[]
  return new Promise((resolve,reject)=>{
    content[0]=data.SalesForecasting.Count;
    content[1]=data.MarketBasket.Count;
    content[2]=data.RFM.Count;
    content[3]=data.ChurnAnalysis.Count;
    content[4]=data.LifeTimeModelling.Count;
    content[5]=data.MarketResponse.Count;
    content[6]=data.UpliftModelling.Count;
    let i = content.indexOf(Math.max(...content));
    let i1 = content.indexOf(Math.min(...content));
   
    
    if(i==0){
      most="SalesForecasting"
    }
    else if(i==1){
       most="Market Basket"
    }
    else if(i==2){
      most="Segmentation"
    }
    else if(i==3){
      most="Churn Analysis"
    }
    else if(i==4){
      most="Customer LifeTime Modelling"
    }
    else if(i==5){
      most="Market Response Modelling"
    }
    else if(i==6){
      most="Uplift Modelling"
    }


    if(i1==0){
      least="SalesForecasting"

    }
    else if(i1==1){
      least="Market Basket"
    }
    else if(i1==2){
      least="Segmentation"
    }
    else if(i1==3){
      least="Churn Analysis"
    }
    else if(i1==4){
      least="Customer LifeTime Modelling"
    }
    else if(i1==5){
      least="Market Response Modelling"
    }
    else if(i1==6){
      least="Uplift Modelling"
    }
   
  setTimeout(()=>{
            
    resolve([most,least])
  },2000)

})

}

// find the revenue of user plan
function revenuefind(users){
  return new Promise((resolve,reject)=>{
    let len=users.length;
    let revenue=[0,0,0]
    users.map((data,index)=>{
        
        if(data.Pay==50){
             revenue[0]=revenue[0]+50;
             revenue[2]=revenue[2]+50;
        }
        else if(data.Pay==100){
          revenue[1]=revenue[1]+100;
          revenue[2]=revenue[2]+100;
          
        }
        else if(data.Pay==150){
          revenue[0]=revenue[0]+50;
          revenue[1]=revenue[1]+100;
          revenue[2]=revenue[2]+150;
          
        }
     
      

      if(index==len-1){    
          resolve(revenue)
      }

    })
  })

}

//find all details of admin dashboard
router.get('/',auth,(req,res)=>{  
 let count=0;
  const userId=res.userId
  Customer.countDocuments( function(err, c) {
    count=c;
  });
  
  let content,content1,revenue;
  Action.findOne()
  .then(data=>{
        async function validate(){
           content= await Countenableordisable(data)
            content1=await Countmostorleast(data)
     
        }
    validate()
    .then(()=>{
      Customer.find({})
      .then(function (users) {

        async function validate1(){
            revenue= await revenuefind(users)
            
        }
        validate1()
        .then(()=>{
          res.send({
            count:count,
            enable:content[0],
            disable:content[1],
            most:content1[0],
            least:content1[1],
            revenue:revenue
    
          })
         })
         .catch(err=>{
          res.status(400).send()
         })
      })
      .catch(err=>{
        res.status(400).send()
       })
    
      
    
    })
    .catch(err=>{
      res.status(400).send()
     })

  })
  


   
  
  });

//find status of predictions
router.get('/status',auth,(req,res)=>{  
   
     const userId=res.userId
     
     let content;
     Action.findOne()
     .then(data=>{
        async function validate(){
         content= await Countenableordisable(data)
         
        
        }
       validate().then(()=>{
       
         res.send({
          
         checked:content[2],
          
   
         })
       
       })
   
     })
     
   
   
      
     
});
// update status of predictions
router.post('/updatestatus',auth,(req,res)=>{  
   
      const userId=res.userId;
      const checked=req.body.checked
      Action.updateOne({},{'SalesForecasting.AbleorDisable':checked[0], 'MarketBasket.AbleorDisable':checked[1],'RFM.AbleorDisable':checked[2],'ChurnAnalysis.AbleorDisable':checked[3],'LifeTimeModelling.AbleorDisable':checked[4],'MarketResponse.AbleorDisable':checked[5],'UpliftModelling.AbleorDisable':checked[6]},function(err, res) {
        if (err) {
            throw err
            console.log(err);
        }
       
      })
      res.status(200).send('save')      
});


  module.exports =router;