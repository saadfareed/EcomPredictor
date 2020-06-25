const mongoose = require('mongoose');
const schema =mongoose.Schema;

const actionschema=new schema({

    SalesForecasting:{
        
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }
    },
    MarketBasket:{
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }

    },
    RFM:{
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }
    },
    ChurnAnalysis:{
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }
    },
    LifeTimeModelling:{
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }
    },
    MarketResponse:{
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }
    },
    UpliftModelling:{
        AbleorDisable:{
            type:Boolean,
            default: true
    
        },
        Count:{
            type:Number,
            default:0
        }
    }
    
})

module.exports=Action=mongoose.model('Action',actionschema);