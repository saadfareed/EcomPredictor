var jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');
function auth(req,res,next){
    const token=req.headers.token;
    
    if(!token){
        return res.status(401).send('access denied')
    }

    try{
           var decoded = jwt.verify(token, 'jwtPrivateKey');
           
           Admin.findOne({_id:decoded._id})
            .then( data=>{
             if( data ){
                res.userId=decoded._id;
                next()
             }
             else{
                
               return res.status(401).send('access denied')
                 
             }
            
            });
              
           
          
           
    }
    catch{
           res.status(401).send('invalid token')
          }
}
module.exports=auth