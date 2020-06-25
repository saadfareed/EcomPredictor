var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const bodyParser=require('body-parser')
const path=require('path')
const Action=require('./Models/Actions')
const Customer=require('./Models/Customer')
const auth=require('./validation/auth')

let p = require('python-shell');
app.use(cors());
const mongoose = require('mongoose');
const PORT=process.env.PORT|| 3000

const upload_data = require('./api/routes/upload_data.js');
const Sales_Forecast = require('./api/routes/sales_forecasting.js')
const start_processing = require('./api/routes/start_processing.js')
const market_basket = require('./api/routes/market_basket.js')
const market_response = require('./api/routes/marketResponse.js')
const segmentation = require('./api/routes/segmentation.js')
const ltv = require('./api/routes/ltv.js')
const churn_analysis = require('./api/routes/churn_analysis.js')
const uplift = require('./api/routes/upliftmodelling.js')
const customerDetail = require('./api/routes/customerDetail')
const signup = require('./api/routes/signup.js')
const login = require('./api/routes/login.js')
const adminLogin = require('./api/routes/adminLogin.js')
const adminstats = require('./api/routes/adminstats.js')
const userstat = require('./api/routes/userstat.js')
const payment = require('./api/routes/payement.js')

const cookieParser = require('cookie-parser')
const stripe=require("stripe")("sk_test_Iy6pidel2UOXkqB21r6LlKH700lo4cbZar")
const uuid=require("uuid/v5")
const reset = require('./api/routes/reset.js')
const db=require('./config/keys').mongoURI;
const refresh = require('./api/routes/refresh.js')

//const uuid =require('react-uuid')

//const { v4: uuid } = require('uuid');

//connecting DB
mongoose.connect(db,{
  useUnifiedTopology: true,
  useNewUrlParser: true,})
      .then(()=>console.log('connected'))
      .catch(err=>console.log(err));


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/refresh',refresh)



//routes
app.use('/api/start-processing', start_processing)
app.use('/api/sales-forecasting',Sales_Forecast);
app.use('/api/market-basket', market_basket);
app.use('/api/segmentation', segmentation);
app.use('/api/lifetimemodelling', ltv);
app.use('/api/churn-analysis', churn_analysis);
app.use('/api/market-response', market_response);
app.use('/api/uplift', uplift);
app.use('/api/upload',upload_data);
app.use('/api/signup',signup)
app.use('/api/login',login)
app.use('/api/adminLogin',adminLogin)
app.use('/api/stats',adminstats)
app.use('/api',userstat)
app.use('/api/payment',payment)
app.use('/api/getCustomers',customerDetail)
app.use('/api/password',reset)

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  
   
  }

  
//listening
app.listen(PORT, () => { 
    console.log("Listening on 3000...") 
});


module.exports = app;