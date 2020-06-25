const Admin=require('../Models/Admin')

const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');

module.exports = function validateAdminloginInput(admindata) {
    let errors={};
    let token;
    
    
  
        return new Promise((resolve,reject)=>{
              if (admindata.Password=="") {
                errors.Password = 'Password field is required';
              }

              if (admindata.Email=="") {
                errors.Email = 'Email field is required';
              }
              else{
              
                    Admin.findOne({Email:admindata.Email})
                    .then(data=>{
                        if(!data){

                        
                          errors.Email="incorrect email"
                            
                        }
                        else{
                            async function checkPassword() {
  
                                let validPassword = await bcrypt.compare(admindata.Password,data.Password)
                                if(validPassword==true){
                                 
                                   token = jwt.sign({ _id:data._id  },'jwtPrivateKey');
                                
                                  
                                 
                                 
                                 // data.token = token;
                                 // data.update();
                 
                                 }
                                 else{
                                    errors.Password="incorrect password"
                                  
                                   
                                 }
                            }
                            if(admindata.Password!=""){
                                checkPassword()
                            }
                            
                        }
                            
                
                    })
                }
               
                setTimeout(()=>{
            
                  resolve([errors,token])
                },1000)
                 
            
        })


  };