const mongoose = require('mongoose');
const schema =mongoose.Schema;

const recordschema=new schema({
    Customer: {
        type: schema.Types.ObjectId,
        ref: 'customers'
    },
   
    LTV:{
        error:{
            type:String,
        
    
        },
        trainingAccuracy:{
            type:String
        },
        testAccuracy:{
            type:String
        }

    },
    RFM:{
        error:{
            type:String,
        
    
        },

    },
    UL:{
        error:{
            type:String,
        
    
        },
        Accuracy:{
            type:Array
        }

    },
    CA:{
        error:{
            type:String,
        
    
        },
        metrics:{
            type:Array
        }

    },
    MB:{
        error:{
            type:String,
        
    
        }
        

    },
    MR:{
        error:{
            type:String,
        
    
        },
        Accuracy:{
            type:Array
        }

    },
    SF:{
        error:{
            type:String,
        
    
        },
        MSE:{
            type:String
        }

    }
         
   


})

module.exports=User=mongoose.model('Records',recordschema);