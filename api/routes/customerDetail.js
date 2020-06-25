const Customer=require('../../Models/Customer')
const express=require('express');
const router=express.Router();
const auth=require('../../validation/authAdmin')
const auth1=require('../../validation/auth')
const bcrypt=require('bcryptjs')

//find executed predictions
function executed(users){
  return new Promise((resolve,reject)=>{
    let len=users.length;
    let executed=[]
    users.map((data,index)=>{
      let str=''
      if(data.SelectedAction.SFexecuted==true){
        
        str=str.concat('SalesForecating ');
        
      }
      if(data.SelectedAction.RFMexecuted==true){
        str=str.concat('RFM ');
      }
      if(data.SelectedAction.MBexecuted==true){
        str=str.concat('MarketBasket ');

      }
      if(data.SelectedAction.LTVexecuted==true){
        str=str.concat('LTV ');

      }
      if(data.SelectedAction.CAexecuted==true){
        str=str.concat('Churn');

      }
      if(data.SelectedAction.MRexecuted==true){
        str=str.concat('MarketResponse ');
      }
      if(data.SelectedAction.ULexecuted==true){
        str=str.concat('Uplift ');
      }
      executed[index]=str
      if(index==len-1){    
          resolve(executed)
      }

    })
  })

}

//find all users
router.get('/',auth,(req,res)=>{  

    let content;
    Customer.find({}).then(function (users) {

        async function validate(){
            content= await executed(users)
           
           
        }
          validate().then(()=>{
          
            res.send({
              customers:users,
              executed:content
            })
          
          })

       
   
  
  });

})

//delete users
router.post('/delete',auth,(req,res)=>{  
 
  const email=req.body.email;
         
         Customer.findOneAndDelete({Email:email})
         .then(a=>{
          let content;
          Customer.find({}).then(function (users) {
      
              async function validate(){
                  content= await executed(users)
                 
                 
              }
                validate().then(()=>{
                
                  res.send({
                    customers:users,
                    executed:content
                  })
                
                })
          })

         })
         .catch(err=>{
          res.status(400).send()
         })
        


})

//get profile info
router.get('/profileinfo',auth1,(req,res)=>{  
 
  const userId=res.userId
         
         Customer.findOne({_id:userId})
         .then(data=>{
           res.send({
             profile:data
           })
          
          

         })
         .catch(err=>{
          res.status(400).send()
         })
        


})

// update user info
router.post('/updateinfo',auth1,(req,res)=>{  
 
  const userId=res.userId
  if(req.body.id==1)
  {
    Customer.updateOne({_id:userId},{Firstname:req.body.val})
  .then(
    res.status(200).send("save")
  )
  .catch((err)=>{
   res.status(400).send()
   
  })  

  }
  else if(req.body.id==2){
    Customer.updateOne({_id:userId},{Lastname:req.body.val})
  .then(
    res.status(200).send("save")
  )
  .catch((err)=>{
   res.status(400).send()
   
  })  

  }

  

//change password
router.post('/changepassword',auth1,(req,res)=>{ 
  
  
  const userId=res.userId
         
         Customer.findOne({_id:userId})
         .then(data=>{
          bcrypt.genSalt(10, (errB, salt) => {
            bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
                if (err) throw err;
                let newPassword = hash;
                Customer.updateOne({_id:userId},{Password:newPassword},function(err, res) {
                  if (err) {
                      throw err
                      console.log(err);
                  }
                 
                 });
                 res.status(200).send()
                
              
                
            });
          })
        

         })
         .catch(err=>{
          res.status(400).send()
         }) 


})

})


// check password is valid or not
router.post('/checkpassword',auth1,(req,res)=>{ 
  
  
  const userId=res.userId
         
         Customer.findOne({_id:userId})
         .then(data=>{
          async function checkPassword() {

          let validPassword = await bcrypt.compare(req.body.password,data.Password)
          if(validPassword==true){
            
           
              res.status(200).send({
                check:true
              })

           }
           else{
            res.status(200).send({
              check:false
            })
             
           }
          }
          checkPassword()
           
          
          

         })
         .catch(err=>{
          res.status(400).send()
         })
        


})
//change password

router.post('/changepassword',auth1,(req,res)=>{ 
  
  
  const userId=res.userId
         
         Customer.findOne({_id:userId})
         .then(data=>{
          async function checkPassword() {

            let validPassword = await bcrypt.compare(req.body.password,data.Password)
            if(validPassword==true){
              bcrypt.genSalt(10, (errB, salt) => {
                bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
                    if (err) throw err;
                    let newPassword = hash;
                    Customer.updateOne({_id:userId},{Password:newPassword},function(err, res) {
                      if (err) {
                          throw err
                          console.log(err);
                      }
                     
                     });
                     res.status(200).send({check:true})
                    
                  
                    
                });
              })
              
             
               
  
             }
             else{
              res.status(200).send({
                check:false
              })
               
             }
          }
          checkPassword()
          
          
         })
         .catch(err=>{
          res.status(400).send({check:false})
         })
      
})

  module.exports =router;