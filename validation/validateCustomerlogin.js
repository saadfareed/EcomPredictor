const Customer=require('../Models/Customer')

const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');

module.exports = function validateloginInput(customerdata) {
    let errors={};
    let token;
    
    
  
        return new Promise((resolve,reject)=>{
              if (customerdata.Password=="") {
                errors.Password = 'Password field is required';
              }

              if (customerdata.Email=="") {
                errors.Email = 'Email field is required';
              }
              else{
              
                    Customer.findOne({Email:customerdata.Email})
                    .then(data=>{
                        if(!data){

                        
                          errors.Email="incorrect email"
                            
                        }
                        else{
                            async function checkPassword() {
  
                                let validPassword = await bcrypt.compare(customerdata.Password,data.Password)
                                if(validPassword==true){
                                 
                                 
                                   token = jwt.sign({ _id:data._id },'jwtPrivateKey');
                                  
                                
                                  
                                 
                                 
                                 // data.token = token;
                                 // data.update();
                 
                                 }
                                 else{
                                    errors.Password="incorrect password"
                                  
                                   
                                 }
                            }
                            if(customerdata.Password!=""){
                                checkPassword()
                            }
                            
                        }
                            
                
                    })
                }
               
                setTimeout(()=>{
                  console.log("er")
                  console.log(errors)
            
                  resolve([errors,token])
                },1000)
                 
            
        })


  };