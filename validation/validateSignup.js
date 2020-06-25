const Customer=require('../Models/Customer')
const emailExistence=require('email-existence')
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');
const Verifier = require("email-verifier");
 

var letters = /^[A-Za-z]+$/;

module.exports = function validatesignUpInput(customerdata) {
  
    let errors = {};
    
  
        return new Promise((resolve,reject)=>{
         
            

             
                if(customerdata.Firstname=="" )
                {
                     errors.Firstname="Firstname is required"
                }
                else if(!customerdata.Firstname.match(letters)){
                    errors.Firstname="Firstname is incorrect"
                }
                if(customerdata.Lastname=="" )
                {
                     errors.Lastname="Lastname is required"
                }
                else if(!customerdata.Lastname.match(letters)){
                    errors.Lastname="Lastname is incorrect"
                }
                if(customerdata.Password=="" )
                {
                     errors.Password="Password is required"
                }
                if (customerdata.Email=="") 
                {
                    errors.email = 'Email field is required';
                    resolve(errors)
                }
                  else{
                    let verifier = new Verifier("at_DNSn4LSiG7LwSs2fnj0wRhhanFqZp");
                    verifier.verify(customerdata.Email, (err, data) => {
                      if (err) 
                      {
                        errors.email = 'incorret email';
                        resolve(errors)
                      }
                      else{
                        Customer.findOne({Email:customerdata.Email})
                        .then(data=>{
                            if(data){
                                errors.email="email already exist"
                                
                            }
                            resolve(errors)
                                
                    
                        })

                      }
                      
                    
                      
                          
                      });
                     
                  }
               
                 
            
        })


  };