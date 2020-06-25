const express = require("express");
const router = express.Router();
//const Customer = require("C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\Models\\Customer.js");
const Customer = require('../../Models/Customer');
var app = express();
var multer = require('multer')
var cors = require('cors');
const auth=require('../../validation/auth')
var fs = require('fs');
var path=require('path')


app.use(cors());


let userID ;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        var ext = path.extname(file.originalname);
        if(ext !== '.csv' ) {
            return cb(new Error('Only csv are allowed'))
        }
        cb(null, 'public')
           
    
  },
  filename: function (req, file, cb) {
   
    cb(null,  userID +'.csv');  
  }
});

var upload = multer({ storage: storage,  limits: { fileSize: 100 * 1024 * 1024   } }).single('file');

//view details
router.get('/view',auth,(req,res)=>{
    let userId=res.userId
    
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){
            let a1 = data.DataUploaded;
            
        res.send({
            uploaded: a1 
        });
    }
    });
});
//uplaod data
router.post('/', auth,(req, res) => {
    userID=res.userId
    
 
    upload(req, res, function (err) {
        
        if (err instanceof multer.MulterError) {
            
            return res.status(500).json(err)
        }
        else if (!req.file) {
            return res.status(500).json(err)
          
        }
         else if (err) {
           
            return res.status(500).json(err)
        }
        var dir = `./excel_files/${userID}`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
     }
        
    
    Customer.updateOne({_id:userID},{DataUploaded: true },function(err, res) {
        if (err) {
            throw err
            console.log(err);
        }   
    });
    return res.status(200).send(req.file)
 });


});
module.exports = router;




