const mongoose = require('mongoose');
const schema =mongoose.Schema;

const customerchema=new schema({
    Email:{
        type:String,
        required:true,
    },
    Firstname:{
        type:String,
        required:true
    },
    Lastname:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        
    },
    Plan:{
        type:String,
        
    },
    
    DataUploaded:{
        type:Boolean,
        default: false

    },
    Pay:{
        type:Number,
        default:0
    },
    date: {
        type: Date,
        default: Date.now
    },
    Plan:{
        type:String,
        default:"Free"
    },
    SelectedAction:{
        
        RFM:{
            type:Boolean,
            default: false
    
        },
        RFMexecuted:{
            type:Boolean,
            default: false
        },
        RFMerror:{
            type:Boolean,
            default: false
        },
        Salesforecasting:{
            type:Boolean,
            default: false
    
        },
        SFexecuted:{
            type:Boolean,
            default: false
        },
        SFerror:{
            type:Boolean,
            default: false
        },
        MarketBasket:{
            type:Boolean,
            default: false
    
        },
        MBexecuted:{
            type:Boolean,
            default: false
        },
        MBerror:{
            type:Boolean,
            default: false
        },
        LTV:{
            type:Boolean,
            default: false
    
        },
        LTVexecuted:{
            type:Boolean,
            default: false
        },
        LTVerror:{
            type:Boolean,
            default: false
        },
        CA:{
            type:Boolean,
            default: false
    
        },
        CAexecuted:{
            type:Boolean,
            default: false
        },
        CAerror:{
            type:Boolean,
            default: false
        },
        MR:{
            type:Boolean,
            default: false
    
        },
        MRexecuted:{
            type:Boolean,
            default: false
        },
        MRerror:{
            type:Boolean,
            default: false
        },
        UL:{
            type:Boolean,
            default: false
    
        },
        ULexecuted:{
            type:Boolean,
            default: false
        },
        ULerror:{
            type:Boolean,
            default: false
        },

     },
     token:{
        type:String,
        default:''
    },

    
 

})

module.exports=Customer=mongoose.model('Customer',customerchema);