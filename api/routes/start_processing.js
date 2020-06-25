
const express = require("express");
const router = express.Router();
var app = express();
var cors = require('cors');
app.use(cors());
const Customer=require('../../Models/Customer')
const Action=require('../../Models/Actions')
const Record=require('../../Models/Record')
let p = require('python-shell');
const auth=require('../../validation/auth')

// start etl scripts
function execute_etl (userId) {

    return new Promise((resolve,reject)=>{
        
       
       let val;
       // let pyshell = new p.PythonShell('D:\\ecom-predictor\\backend\\python_scripts\\hello.py');
        let pyshell = new p.PythonShell('./python_scripts/hello.py');
        pyshell.send(userId);
    pyshell.on('message', function (message) {
        //console.log(message)
        val=message
        
    });
    pyshell.end(function (err,code,signal) {
        if (err) throw err;
        console.log(val)
        resolve(val)
         
       
    });
        
      
  })
    //let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\hello.py');
    
}



// execute arima scripts
function execute_ARIMA(userId) {
    return new Promise((resolve,reject)=>{
       let check=0;
       let val;
    //let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\ARIMA.py');
    let pyshell = new p.PythonShell('./python_scripts/ARIMA.py');
    pyshell.send(userId);
    pyshell.on('message', function (message) {
       
        if(check==27){
            val=message;
        }
        check++;
        console.log(message)
        //console.log('ARIMA Running....');  
    });
    pyshell.end(function (err,code,signal) {
        if (err) throw err;
    
        console.log('ARIMA Executed'); 
        resolve(val) 
        
        });
    })
    
}
// view actions detail
router.get('/view-actions',auth,function(req,res){
    const userId=res.userId
  
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){
            let a1 = data.SelectedAction.Salesforecasting;
            let a2 = data.SelectedAction.MarketBasket;
            let a3 = data.SelectedAction.RFM;
            let a4 = data.SelectedAction.LTV;
            let a5 = data.SelectedAction.CA;
            let a6 = data.SelectedAction.MR;
            let a7 = data.SelectedAction.UL;
            let a1_executed = data.SelectedAction.SFexecuted;
            let a2_executed = data.SelectedAction.MBexecuted;
            let a3_executed = data.SelectedAction.RFMexecuted;
            let a4_executed = data.SelectedAction.LTVexecuted;
            let a5_executed = data.SelectedAction.CAexecuted;
            let a6_executed = data.SelectedAction.MRexecuted;
            let a7_executed = data.SelectedAction.ULexecuted;
            let a1_error= data.SelectedAction.SFerror;
            let a2_error= data.SelectedAction.MBerror;
            let a3_error= data.SelectedAction.RFMerror;
            let a4_error= data.SelectedAction.LTVerror;
            let a5_error= data.SelectedAction.CAerror;
            let a6_error= data.SelectedAction.MRerror;
            let a7_error= data.SelectedAction.ULerror;
            
        res.send({
            sf: a1 ,
            mb: a2 ,
            rfm: a3,
            ltv:a4,
            ca:a5,
            mr:a6,
            ul:a7,
            a1_executed,
            a2_executed,
            a3_executed,
            a4_executed,
            a5_executed,
            a6_executed,
            a7_executed,
            a1_error,
            a2_error,
            a3_error,
            a4_error,
            a5_error,
            a6_error,
            a7_error

        });
    }
    });
});
//start processing

router.get('/',auth, function(req, res) {
    const userId=res.userId
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){
            let isDataUpload = data.DataUploaded;
            let sf_var = false;
            let RFM_var = false;
            let mb_var = false;
            let ltv_var = false;
            let ca_var = false;
            if(isDataUpload === true){
                function saleforecast()
                {
                    return new Promise((resolve,reject)=>{
                    if(data.SelectedAction.Salesforecasting)
                    {
                        sf_var = true;
                        let val1;
                         async function validate(){
                            let val=await execute_etl(userId);
                            if(val.charAt(0)=='K'){
                                Customer.updateOne({_id:userId},{ 'SelectedAction.SFexecuted': false ,'SelectedAction.Salesforecasting': true,'SelectedAction.SFerror': true},function(err, res) {
                                    if (err) {
                                        throw err
                                        console.log(err);
                                    }
                                  })
                                  Record.findOne({Customer:userId})
                                  .then(data=>{
                                      if(data){
                                        Record.updateOne({Customer:userId},{ 'SF.error': val},function(err, res) {
                                            if (err) {
                                                throw err
                                                console.log(err);
                                            }
                                        })


                                      }
                                      else{
                                          const record=new Record({
                                              Customer:userId,
                                              SF:{
                                                  error:val
                                              }
                                          })
                                          record.save()

                                      }
                                  })

                            }
                            else if(val.charAt(0)=='E'){
                                val1=await execute_ARIMA(userId);
                                
                                Customer.updateOne({_id:userId},{ 'SelectedAction.SFexecuted': true ,'SelectedAction.Salesforecasting': false,'SelectedAction.SFerror': false},function(err, res) {
                                    if (err) {
                                        throw err
                                        console.log(err);
                                    }
                                    Action.updateOne({},{ $inc: { 'SalesForecasting.Count': 1}},function(err, res) {
                                        if (err) {
                                          throw err
                                          console.log(err);
                                        }
                                        
                                       
                                      })
                                      Record.findOne({Customer:userId})
                                      .then(data=>{
                                       if(data){
                                          Record.updateOne({Customer:userId},{ 'SF.MSE': val1},function(err, res) {
                                          if (err) {
                                            throw err
                                            console.log(err);
                                           }
                                          })


                                       }
                                     else{
                                        const record=new Record({
                                            Customer:userId,
                                            SF:{
                                                MSE:val1,
                                                
                                            }
                                        })
                                        record.save()

                                     }
                                     })
                                })
                            
                            }
                            
                         
                         }
                         validate().then(()=>{
                           
                                
                              resolve()
                             
                            
                         });
                            
                       
                        
                    }
                    else{
                        resolve()
                    }
                    })
                   


                }
                function  RFM()
                {
                    return new Promise((resolve,reject)=>{
                        if(data.SelectedAction.RFM)
                        {
                            RFM_var = true;
                            //let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\RFM.py');
                            let pyshell = new p.PythonShell('./python_scripts/RFM.py');
                            pyshell.send(userId);
                            let val;
                            pyshell.on('message', function (message) {
                                console.log(message);
                               val=message;
                                
                            });
                            pyshell.end(function (err,code,signal) {
                                if (err) throw err;
                                
                                if(val.charAt(0)=='K'){
                                   

                                    Customer.updateOne({_id:userId},{ 'SelectedAction.RFMexecuted': false ,'SelectedAction.RFM': true,'SelectedAction.RFMerror': true},function(err, res) {
                                      if (err) {
                                          throw err
                                          console.log(err);
                                      }
                                    })
                                    Record.findOne({Customer:userId})
                                    .then(data=>{
                                        if(data){
                                          Record.updateOne({Customer:userId},{ 'RFM.error': val},function(err, res) {
                                              if (err) {
                                                  throw err
                                                  console.log(err);
                                              }
                                          })
  
  
                                        }
                                        else{
                                            const record=new Record({
                                                Customer:userId,
                                                RFM:{
                                                    error:val
                                                }
                                            })
                                            record.save()
  
                                        }
                                    })
                                  }
                                  else if(val.charAt(0)=='R'){
                                      
                                      Customer.updateOne({_id:userId},{ 'SelectedAction.RFMexecuted': true ,'SelectedAction.RFM': false,'SelectedAction.RFMerror': false},function(err, res) {
                                          if (err) {
                                              throw err
                                              console.log(err);
                                          }
                                          Action.updateOne({},{ $inc: { 'RFM.Count': 1}},function(err, res) {
                                              if (err) {
                                                throw err
                                                console.log(err);
                                              }
                                              
                                             
                                            })
                                            
                                      })
                                  }
                                
                                
                                  resolve()
                                
        
                                });
                        }
                        else{
                            resolve()
                        }


                    })

                }
                function MarketBasket()
                {
                   
                    return new Promise((resolve,reject)=>{
                     
                        if(data.SelectedAction.MarketBasket){
                            mb_var = true; 
                            let val;
                            //let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\Market_Basket.py');
                            let pyshell = new p.PythonShell('./python_scripts/Market_Basket.py');
                            pyshell.send(userId);
                            pyshell.on('message', function (message) {
                                console.log(message);
                                val=message
                                
                                
                            });
                            pyshell.end(function (err,code,signal) {
                                
                                if (err) throw err;
                                if(val.charAt(0)=='K'){
                                   

                                    Customer.updateOne({_id:userId},{ 'SelectedAction.MBexecuted':false ,'SelectedAction.MarketBasket': true,'SelectedAction.MBerror': true},function(err, res) {
                                      if (err) {
                                          throw err
                                          console.log(err);
                                      }
                                    })
                                    Record.findOne({Customer:userId})
                                    .then(data=>{
                                        if(data){
                                          Record.updateOne({Customer:userId},{ 'MB.error': val},function(err, res) {
                                              if (err) {
                                                  throw err
                                                  console.log(err);
                                              }
                                          })
  
  
                                        }
                                        else{
                                            const record=new Record({
                                                Customer:userId,
                                                MB:{
                                                    error:val
                                                }
                                            })
                                            record.save()
  
                                        }
                                    })
                                  }
                                  else if(val.charAt(0)=='M'){
                                      
                                      Customer.updateOne({_id:userId},{ 'SelectedAction.MBexecuted': true ,'SelectedAction.MarketBasket': false,'SelectedAction.MBerror': false},function(err, res) {
                                          if (err) {
                                              throw err
                                              console.log(err);
                                          }
                                          Action.updateOne({},{ $inc: { 'MarketBasket.Count': 1}},function(err, res) {
                                              if (err) {
                                                throw err
                                                console.log(err);
                                              }
                                              
                                             
                                            })
                                            
                                      })
                                  }
                                
                                
                                
                               
                                  resolve()
                                
        
                                });
                                
                        }
                        else{
                            resolve()
                        }
                    

                    })
                }
                function  Churn()
                {
                    return new Promise((resolve,reject)=>{

                        if(data.SelectedAction.CA){
                            let check=0;
                            let val=[]
                            ca_var = true; 
                           // let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                           // let pyshell = new p.PythonShell('D:\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                            let pyshell = new p.PythonShell('./python_scripts/churnAnalysis.py');
                            pyshell.send(userId);
                            pyshell.on('message', function (message) {
                               
                                val[check]=message;
                                check++;
                                console.log(message)
                              
                            });
                            pyshell.end(function (err,code,signal) {
                                if (err) throw err;
                                if(check==1){

                                    Customer.updateOne({_id:userId},{ 'SelectedAction.CAexecuted': false ,'SelectedAction.CA': true,'SelectedAction.CAerror': true},function(err, res) {
                                      if (err) {
                                          throw err
                                          console.log(err);
                                      }
                                    })
                                    Record.findOne({Customer:userId})
                                    .then(data=>{
                                        if(data){
                                          Record.updateOne({Customer:userId},{ 'CA.error': val[0]},function(err, res) {
                                              if (err) {
                                                  throw err
                                                  console.log(err);
                                              }
                                          })
  
  
                                        }
                                        else{
                                            const record=new Record({
                                                Customer:userId,
                                                CA:{
                                                    error:val[0]
                                                }
                                            })
                                            record.save()
  
                                        }
                                    })
                                  }
                                  else if(check>1){
                                      Customer.updateOne({_id:userId},{ 'SelectedAction.CAexecuted': true ,'SelectedAction.CA': false,'SelectedAction.CAerror': false},function(err, res) {
                                          if (err) {
                                              throw err
                                              console.log(err);
                                          }
                                          Action.updateOne({},{ $inc: { 'ChurnAnalysis.Count': 1}},function(err, res) {
                                              if (err) {
                                                throw err
                                                console.log(err);
                                              }
                                              
                                             
                                            })
                                            Record.findOne({Customer:userId})
                                            .then(data=>{
                                             if(data){
                                                Record.updateOne({Customer:userId},{ 'CA.metrics': val},function(err, res) {
                                                if (err) {
                                                  throw err
                                                  console.log(err);
                                                 }
                                                })
  
  
                                             }
                                           else{
                                              const record=new Record({
                                                  Customer:userId,
                                                  CA:{
                                                      metrics:val,
                                                      
                                                  }
                                              })
                                              record.save()
  
                                           }
                                           })
                                      })
                                  }
  
                                  
                                     
                                       
                                
                               
                                  resolve()
                                
        
                                });
                                
                        }
                        else{
                            resolve()
                        }
                    

                    })
                }
                function  LTV()
                {
                    return new Promise((resolve,reject)=>{

                        if(data.SelectedAction.LTV){
                            ltv_var = true; 
                           // let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                           // let pyshell = new p.PythonShell('D:\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                            let pyshell = new p.PythonShell('./python_scripts/LTV.py');
                            pyshell.send(userId);
                            let check=0;
                            let val=[];
                            pyshell.on('message', function (message) {
                                console.log(message)
                                val[check]=message
                                check++;
                            });
                            pyshell.end(function (err,code,signal) {
                                console.log(val)
                                if (err) throw err;
                                if(check==1){

                                  Customer.updateOne({_id:userId},{ 'SelectedAction.LTVexecuted':false ,'SelectedAction.LTV': true,'SelectedAction.LTVerror': true},function(err, res) {
                                    if (err) {
                                        throw err
                                        console.log(err);
                                    }
                                  })
                                  Record.findOne({Customer:userId})
                                  .then(data=>{
                                      if(data){
                                        Record.updateOne({Customer:userId},{ 'LTV.error': val[0]},function(err, res) {
                                            if (err) {
                                                throw err
                                                console.log(err);
                                            }
                                        })


                                      }
                                      else{
                                          const record=new Record({
                                              Customer:userId,
                                              LTV:{
                                                  error:val[0]
                                              }
                                          })
                                          record.save()

                                      }
                                  })
                                }
                                else if(check==2){
                                    Customer.updateOne({_id:userId},{ 'SelectedAction.LTVexecuted': true ,'SelectedAction.LTV': false,'SelectedAction.LTVerror': false},function(err, res) {
                                        if (err) {
                                            throw err
                                            console.log(err);
                                        }
                                        Action.updateOne({},{ $inc: { 'LifeTimeModelling.Count': 1}},function(err, res) {
                                            if (err) {
                                              throw err
                                              console.log(err);
                                            }
                                            
                                           
                                          })
                                          Record.findOne({Customer:userId})
                                          .then(data=>{
                                           if(data){
                                              Record.updateOne({Customer:userId},{ 'LTV.trainingAccuracy': val[0] ,'LTV.testAccuracy': val[1]},function(err, res) {
                                              if (err) {
                                                throw err
                                                console.log(err);
                                               }
                                              })


                                           }
                                         else{
                                            const record=new Record({
                                                Customer:userId,
                                                LTV:{
                                                    trainingAccuracy:val[0],
                                                    testAccuracy:val[1]
                                                }
                                            })
                                            record.save()

                                         }
                                         })
                                    })
                                }

                                
                                   
                                     
                                
                               
                                  resolve()
                                
        
                                });
                                
                        }
                        else{
                            resolve()
                        }
                    

                    })
                }
                function  MarketResponse()
                {
                    return new Promise((resolve,reject)=>{

                        if(data.SelectedAction.MR){
                            ltv_var = true; 
                            let check=0;
                            let val=[]
                           // let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                           // let pyshell = new p.PythonShell('D:\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                            let pyshell = new p.PythonShell('./python_scripts/marketResponse.py');
                            pyshell.send(userId);
                            pyshell.on('message', function (message) {
                                console.log(message);
                                val[check]=message;
                                check++;
                                
                            });
                            pyshell.end(function (err,code,signal) {
                                if (err) throw err;
                                if(check==1){
                                   
                                     Customer.updateOne({_id:userId},{ 'SelectedAction.MRexecuted':false ,'SelectedAction.MR': true,'SelectedAction.MRerror': true},function(err, res) {
                                       if (err) {
                                           throw err
                                           console.log(err);
                                       }
                                     })
                                     Record.findOne({Customer:userId})
                                     .then(data=>{
                                         if(data){
                                           Record.updateOne({Customer:userId},{ 'MR.error': val[0]},function(err, res) {
                                               if (err) {
                                                   throw err
                                                   console.log(err);
                                               }
                                           })
   
   
                                         }
                                         else{
                                             const record=new Record({
                                                 Customer:userId,
                                                 MR:{
                                                     error:val[0]
                                                 }
                                             })
                                             record.save()
   
                                         }
                                     })
                                   }
                                   else if(check>1){
                                       
                                       Customer.updateOne({_id:userId},{ 'SelectedAction.MRexecuted': true ,'SelectedAction.MR': false,'SelectedAction.MRerror': false},function(err, res) {
                                           if (err) {
                                               throw err
                                               console.log(err);
                                           }
                                           Action.updateOne({},{ $inc: { 'MarketResponse.Count': 1}},function(err, res) {
                                               if (err) {
                                                 throw err
                                                 console.log(err);
                                               }
                                               
                                              
                                             })
                                             Record.findOne({Customer:userId})
                                             .then(data=>{
                                              if(data){
                                                 Record.updateOne({Customer:userId},{ 'MR.Accuracy': val},function(err, res) {
                                                 if (err) {
                                                   throw err
                                                   console.log(err);
                                                  }
                                                 })
   
   
                                              }
                                            else{
                                               const record=new Record({
                                                   Customer:userId,
                                                   MR:{
                                                       Accuracy:val
                                                   }
                                               })
                                               record.save()
   
                                            }
                                            })
                                       })
                                   }
                                
                               
                                  resolve()
                                
        
                                });
                                
                        }
                        else{
                            resolve()
                        }
                    

                    })
                }
                function  Uplift()
                {
                    return new Promise((resolve,reject)=>{

                        if(data.SelectedAction.UL){
                            ltv_var = true; 
                            let val=[];
                            let check=0;
                           // let pyshell = new p.PythonShell('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                           // let pyshell = new p.PythonShell('D:\\ecom-predictor\\backend\\python_scripts\\LTV.py');
                            let pyshell = new p.PythonShell('./python_scripts/upliftmodeling.py');
                            pyshell.send(userId);
                            pyshell.on('message', function (message) {
                                val[check]=message;
                                check++;
                                console.log(message)
                                
                                
                            });
                            pyshell.end(function (err,code,signal) {
                                if (err) throw err;
                                if(check==1){
                                  
                                    Customer.updateOne({_id:userId},{ 'SelectedAction.ULexecuted': false ,'SelectedAction.UL': true,'SelectedAction.ULerror': true},function(err, res) {
                                      if (err) {
                                          throw err
                                          console.log(err);
                                      }
                                    })
                                    Record.findOne({Customer:userId})
                                    .then(data=>{
                                        if(data){
                                          Record.updateOne({Customer:userId},{ 'UL.error': val[0]},function(err, res) {
                                              if (err) {
                                                  throw err
                                                  console.log(err);
                                              }
                                          })
  
  
                                        }
                                        else{
                                            const record=new Record({
                                                Customer:userId,
                                                UL:{
                                                    error:val[0]
                                                }
                                            })
                                            record.save()
  
                                        }
                                    })
                                  }
                                  else if(check>1){
                                     
                                      Customer.updateOne({_id:userId},{ 'SelectedAction.ULexecuted': true ,'SelectedAction.UL': false,'SelectedAction.ULerror': false},function(err, res) {
                                          if (err) {
                                              throw err
                                              console.log(err);
                                          }
                                          Action.updateOne({},{ $inc: { 'UpliftModelling.Count': 1}},function(err, res) {
                                              if (err) {
                                                throw err
                                                console.log(err);
                                              }
                                              
                                             
                                            })
                                            Record.findOne({Customer:userId})
                                            .then(data=>{
                                             if(data){
                                                Record.updateOne({Customer:userId},{ 'UL.Accuracy': val},function(err, res) {
                                                if (err) {
                                                  throw err
                                                  console.log(err);
                                                 }
                                                })
  
  
                                             }
                                           else{
                                              const record=new Record({
                                                  Customer:userId,
                                                  UL:{
                                                      Accuracy:val
                                                  }
                                              })
                                              record.save()
  
                                           }
                                           })
                                      })
                                  }
                                
                            
                               
                                  resolve()
                                
        
                                });
                                
                        }
                        else{
                            resolve()
                        }
                    

                    })
                }
                saleforecast()
                .then(a=>{  
                    MarketBasket().then(b=>{
                        RFM().then(c=>{
                            Churn().then(d=>{
                                LTV().then(e=>{
                                    MarketResponse().then(f=>{
                                        Uplift().then(g=>{
                                            
                                            
                                        })
                                        

                                    })
                                   

                                })
                                

                            })
                           

                        })

                    })
                })
                .catch(err=>{
                    console.log(err)
                

                })

            

                
                
            }else {
                res.send({
                    isDataUpload: false
                });
            }
            res.status(200).send("ok")
    }
    });
});








module.exports = router;