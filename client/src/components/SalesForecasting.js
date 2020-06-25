import React, { Component } from 'react';
import styles from '../css/sf.module.css';
import axios from 'axios';  
import {Line} from 'react-chartjs-2';
import sf_illustration from '../images/sf-illustration.svg'
import Cookies from 'js-cookie'
import loader from '../images/loading2.gif'
import Skeleton from 'react-loading-skeleton';


class SalesForecasting extends Component {

    constructor(props){
        super(props)
        this.state = {
            added: -1,
            executed: 0,
            data_upload: -1 ,
            graphDataUploaded: 0,
            record:{},
            error:false,
            chartData:{ 
                labels:[],
                  datasets:[
                      {
                        label:'SalesForecasting',
                        data:[
                            
                        ],
                        fill: false,
                        borderColor: '#2196f3', // Add custom color border (Line)
                        backgroundColor: '#2196f3', //
                        pointHoverBackgroundColor: '#fffff',
                        
                        
                      }
                  ]
              },
              isLoading: true,
              isPlotLoading: true
        };
    }    

    addSalesForecast = () => {
        axios.post('/api/sales-forecasting/add','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate()
        });
    }
    removeSalesForecast = () => {
        axios.post('/api/sales-forecasting/remove','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate()
        });
    }

    componentDidMount(){
            axios.get('/api/sales-forecasting/view',{headers: {token: Cookies.get('token')}})
            .then(response => {
               
                //const output = response.value
                const value = response.data.value;
                const executed = response.data.executed;
                console.log(response.data.DataUploaded);
                this.setState({
                    added: value,
                    executed: executed,
                    data_upload: response.data.data_upload,
                    record:response.data.record,
                    error:response.data.error,
                    isLoading:false
                    });
                });
                
               

           
    }

    plotGraph = () => {
        axios.get('/api/sales-forecasting/plot-graph',{headers: {token: Cookies.get('token')}})
            .then(response => {
               

                this.state.chartData.labels=response.data.val.labels;
                let fill=response.data.val.datasets;
                const d=[]
                fill.map(n=>{
                
                    d.push(n)
                })
                var chartData = {...this.state.chartData}
                chartData.datasets[0].data = d;
                this.setState({
                    chartData,
                    graphDataUploaded:1,
                    isPlotLoading: false
                })
                

                
                });


    }
    downloadFile = () => {
      
        window.open('http://localhost:3000/api/sales-forecasting/download','_current');
       
       
    }

    

    componentDidUpdate(prevProps, prevState) {
        

        if (prevState.added !== this.state.added) {
          
        }
      }

  render() {

    if(this.state.executed){
        this.plotGraph();
    }


    if(this.state.isPlotLoading  && this.state.executed){
        return(
            <div>
                <img className={styles.loader}  src={loader} alt="loader"/>
            </div>
        )
    }
    if(this.state.isLoading  && !this.state.executed){
        return(
            <div>
                 <span style={{display: "block" }}>{<Skeleton width={300} height={30}/>} </span>
                 <br/>
                 <span style={{display: "block"} }>{<Skeleton width={400} height={30}/>} </span>
                 <br/>
                 <br/>
                 <span style={{display: "block" }}>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block"} }>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block" }}>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block"} }>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block" }}>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block"} }>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block" }}>{<Skeleton width={600} height={20}/>} </span>
                 <br/>
                 <span style={{display: "block"} }>{<Skeleton width={600} height={20}/>} </span>
                
            </div>
        )
    }

    return( 
        <div>
            <div className="row">
                { this.state.graphDataUploaded == true &&  this.state.error == false  &&
                <div className="col-12">
                    <div className={styles.first_heading}>
                        Sales Forecasting - Visualization
                    </div>
                    <div className="row mt-2">
                        <div className="col-4">
                            <div className="alert alert-success">{this.state.record.MSE}</div>
                        </div>
                        <div className="col-8">
                            <button type="button" className="btn btn-success float-right" onClick={this.downloadFile}>Download ARIMA.xlsx</button>
                    
                        </div>
                    </div>
                    
                    
                    
                    {/*  */}    
                    <div className="chart mt-2">
                        
                        <Line
                        width={100}
                        height={47}
                        data={this.state.chartData}
                        options={{
                            maintainAspectRatio:true,
                            responsive: true,
                            
                            
                            
                        }}      
                        />
                    
                    </div>
                    

                </div>}
                { this.state.executed == false && this.state.error == true  &&
                
                <div class="alert alert-warning mb-3 btn-block" role="alert">
                    <p>Every Prediction has a required set of columns that needs to be there in order to perform it.</p>
                    However, We did not find the following columns in your uploaded dataset: 
                    <div class="alert alert-danger mt-3"><b>{this.state.record.error}</b></div>
                    <b>Tip: </b>Make sure to match spellings, case and upload again.
                
              </div>
            }
                <div className="col-6">
                    {this.state.executed === false &&
                    <div className={styles.first_heading}>
                        Sales Forecasting
                    </div>}
                    
                    
                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        This prediction basically applies forecasting technique
                        based on the two following attributes. 
                        Our Predictor System will forecast the sales of the ecommerce store data. The ARIMA model can be characterized into 3 parts i.e. AR, I and MA, these 3 terms are the number of lags in the y column for the predictors, the number of differentiations needed to make the time series constant and the number of lagged forecast errors in the ARIMA model respectively. The accuracy for the model is considered way above average
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.paragraph}>
                        For this prediction to work, the following columns must be 
                        present In your excel file
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.cols}>
                        invoice date,  invoice #, unit price, country
                    </div>}
                    
                    
                    {this.state.added == false && this.state.executed === false && this.state.data_upload == true &&
                        <button type="button" className="btn btn-primary" onClick={this.addSalesForecast}>Include this prediction</button>
                    }
                    {  this.state.executed == false && this.state.data_upload == false &&
                        <div className="alert alert-danger" role="alert">
                            Please upload data first to <b>"include this prediction"</b>
                        </div>  
                    }
                    {this.state.added == true && this.state.executed === false && this.state.data_upload ==true &&
                        <button type="button" className="btn btn-primary" onClick={this.removeSalesForecast}>Remove this prediction</button>
                    }


                </div>
                {this.state.executed === false && 
                <div className="col-6">
                    <img className={styles.illustration} src={sf_illustration} alt="sales forecasting image"/>
                </div>}
                
            </div>
            
        </div>
    );
  };
}   
export default SalesForecasting;