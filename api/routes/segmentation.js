const express = require("express");
const router = express.Router();
//const Customer = require("C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\Models\\Customer.js");
const Customer = require('../../Models/Customer');
const Record = require('../../Models/Record');
var cors = require('cors');
var app = express();
const auth=require('../../validation/auth')
const xlsx=require('xlsx')
app.use(cors());
let p = require('python-shell');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.use(cookieParser());


// view detail of selected actions
router.get('/view',auth, function(req, res) {
     const userId=res.userId
    // console.log(userId)
   // const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){
            let salevalue=data.SelectedAction.RFM;
            let executed= data.SelectedAction.RFMexecuted;
            let error=data.SelectedAction.RFMerror
            Record.findOne({Customer:userId})
            .then(data1=>{
                if(data1){
                    res.send({
                        value: salevalue,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        record:data1.RFM,
                        error:error
                    });
                    

                }
                else{
                    res.send({
                        value: salevalue ,
                        executed: executed,
                        data_upload: data.DataUploaded,
                        error:error,
                    });

                }

            })
        
        
    }
    });
});

//add in selected actions

router.post('/add', auth,function(req, res) {
    const userId=res.userId

   // const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

           
            Customer.updateOne({_id:userId},{'SelectedAction.RFM':true},function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "RFM added",
                added: true,
            });

        }
        });

});

//remove from selected actions
router.post('/remove',auth, function(req, res) {
    const userId=res.userId

    //const email="Hamzakhan003@gmail.com"
    Customer.findOne({_id:userId})
    .then(data=>{
        if(data){

           
            Customer.updateOne({_id:userId},{'SelectedAction.RFM':false },function(err, res) {
                if (err) {
                    throw err
                    console.log(err);
                }   
            });
            res.send({
                message: "RFM remove",
                added: false,
            });

        }
        });

});


//plot graph
router.get('/plot-graph',auth, function(req, res) {
    const userId=res.userId
   // const w=xlsx.readFile('C:\\Users\\WALEED.AHMAD\\Documents\\FYP\\project\\ecom-predictor\\backend\\excel_files\\custSeg.xlsx')
    const w=xlsx.readFile(`./excel_files/${userId}/custSeg.xlsx`)
    const s=w.SheetNames;
    let data1=xlsx.utils.sheet_to_json(w.Sheets[s[0]]);
    const chartData= {
        datasets: [{
            label: 'Revenue vs Recency',
            data: []
        }]
    }
    let fill=[];
    let point=[]
    data1.map(n=>{
        
        fill.push({x:n.Recency,y:n.Revenue})
        if(n.Segment=="Low-Value"){
           point.push("rgb(0,0,255)")
        }
        if(n.Segment=="Mid-Value"){
            point.push("rgb(0,128,0)")
         }
         if(n.Segment=="High-Value"){
            point.push("rgb(255,0,0)")
         }
    
        
    })
    chartData.datasets[0].data=fill



    //chart2
    const chartData2= {
        datasets: [{
            label: 'Frequency vs Revenue',
            data: []
        }]
    }
    let fill2=[];
    let point2=[]
    data1.map(n=>{
        
        fill2.push({x:n.Revenue,y:n.Frequency})
        if(n.Segment=="Low-Value"){
           point2.push("rgb(0,0,255)")
        }
        if(n.Segment=="Mid-Value"){
            point2.push("rgb(0,128,0)")
         }
         if(n.Segment=="High-Value"){
            point2.push("rgb(255,0,0)")
         }
    
        
    })
    chartData2.datasets[0].data=fill2



    //chart 3
    const chartData3= {
        datasets: [{
            label: 'Frequency vs Recency',
            data: []
        }]
    }
    let fill3=[];
    let point3=[]
    data1.map(n=>{
        
        fill3.push({x:n.Recency,y:n.Frequency})
        if(n.Segment=="Low-Value"){
            point3.push("rgb(0,0,255)")
        }
        if(n.Segment=="Mid-Value"){
            point3.push("rgb(0,128,0)")
            }
            if(n.Segment=="High-Value"){
            point3.push("rgb(255,0,0)")
            }
    
        
    })
    chartData3.datasets[0].data=fill3

    res.send({
        val:chartData,
        pointcolor:point,
        val2:chartData2,
        pointcolor2:point2,
        val3:chartData3,
        pointcolor3:point3,
    })
});



//downlaod file

router.get('/download', function(req, res){
    const token=req.cookies['token']
    var decoded = jwt.verify(token, 'jwtPrivateKey');
    return res.download( `./excel_files/${decoded._id}/custSeg.xlsx` );
})


module.exports = router;