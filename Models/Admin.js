const mongoose = require('mongoose');
const schema =mongoose.Schema;

const adminschema=new schema({
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true
    },
  
   
 

})

module.exports=Admin=mongoose.model('Admin',adminschema);