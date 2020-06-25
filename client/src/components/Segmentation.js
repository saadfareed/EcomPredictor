import React, { Component } from 'react';
import styles from '../css/rfm.module.css';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';
import rfm_illustration from '../images/s-illustration.svg'
import {Scatter} from 'react-chartjs-2';
import Cookies from 'js-cookie'
import loader from '../images/loading2.gif'
import Skeleton from 'react-loading-skeleton';

class Segmentation extends Component {

    constructor(props){
        super(props)
        this.state = {
            added: -1,
            executed: 0,
            data_upload: -1,
            record:{},
            error:false,
            data: {
                datasets: [{
                    label: 'Revenue vs Recency',
                    data: [],
                    
                }],
                
            },
            pointBackColor:[],
            data2: {
                datasets: [{
                    label: 'Frequency vs Revenue',
                    data: [],
                    
                }],
                
            },
            pointBackColor2:[],
            data3: {
                datasets: [{
                    label: 'Frequency vs Recency',
                    data: [],
                    
                }],
                
            },
            pointBackColor3:[],
            isPlotLoading: true,
            isLoading: true
        };
    }    
    addSegmentation = () => {
        axios.post('/api/segmentation/add','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }

    removeSegmentation = () => {
        axios.post('/api/segmentation/remove','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }
    downloadFile = () => {
        window.open('http://localhost:3000/api/segmentation/download','_current');
    }
    componentDidMount(){
        return axios.get('/api/segmentation/view',{headers: {token: Cookies.get('token')}})
        .then(response => {
            
            const value = response.data.value;
            const executed = response.data.executed;
            
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
        axios.get('/api/segmentation/plot-graph',{headers: {token: Cookies.get('token')}})
            .then(response => {
                this.state.data=response.data.val;
                this.state.pointBackColor=response.data.pointcolor   
                this.state.data2=response.data.val2;
                this.state.pointBackColor2=response.data.pointcolor2            
                this.state.data3=response.data.val3;
                this.state.pointBackColor3=response.data.pointcolor3     
                this.setState({
                    executed: true,
                     isPlotLoading: false, 
                });
            });


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


                { this.state.executed == true && this.state.error == false  &&
                <div className="col-12">
                    <div className={styles.first_heading}>
                        Segmentation (RFM) - with Scatter Graphs
                        
                    </div>
                    <div className="row mt-2">
                        <div className="col-7">
                            <div className= {styles.paragraph}>
                                Results are evaluated succesfully. You can <b>click Download button</b> to see Segmentation Results of the data u uploaded.
                            </div>
                            <button type="button" className="btn btn-success mt-3" onClick={this.downloadFile}>Download custSeg.xlsx</button>
                        </div>
                    </div>
                    <div className="chart">
                        <Scatter
                        width={4}
                        height={2}
                        data={this.state.data}
                        options={{
                            maintainAspectRatio:true,
                            elements: {
                            point: {
                                backgroundColor:this.state.pointBackColor
                            }
                            }                     
                        
                            
                        
                            
                        }}
                        />
                     </div>
                     
                    <div className="chart">
                        <Scatter
                            width={4}
                            height={2}
                            data={this.state.data2}
                            options={{
                                maintainAspectRatio:true,
                                elements: {
                                point: {
                                    backgroundColor:this.state.pointBackColor2
                                }
                                }                     
                            }}
                        />
                    </div>
                    
                    <div className="chart">
                        <Scatter
                            width={4}
                            height={2}
                            data={this.state.data3}
                            options={{
                                maintainAspectRatio:true,
                                elements: {
                                point: {    
                                    backgroundColor:this.state.pointBackColor3
                                }
                                }                     
                            }}
                        />
                    </div>
                    
          
       

                </div>    
                }
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
                        Segmentation
                    </div>}

                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        System would make segments of the customer base into 3 categories
                        Categories are as follows:
                        
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.paragraph}>
                        1.   Customers that buy least frequently and generate low revenue <br/>
                        2.   Customers that buy average amounts <br/>
                        3.   Customers that buy most frequently and generate high revenue <br/>
                    </div>}
                    
                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        RFM (Recency Frequency Modeling) scores would be generated to make segments of the customer base. This would be done using the customer id, product name, quantity, unit sale, invoice number, and date. The results would have every customer score associated with a segment.
                        
                        <br/>
                        <br/>
                        For this prediction to work, the following columns must be 
                        present In your excel file
                    </div>}

                    {this.state.executed === false && 
                    <div className={styles.cols}>
                        'customerid', 'invoicedate', 'quantity', 'unitprice'
                    </div>}
                    
                    
                    {this.state.added == false && this.state.executed === false && this.state.data_upload == true &&
                        <button type="button" className="btn btn-primary" onClick={this.addSegmentation}>Include this prediction</button>
                    }
                    {  this.state.executed == false && this.state.data_upload == false &&
                        <div className="alert alert-danger" role="alert">
                            Please upload data first to <b>"include this prediction"</b>
                        </div>  
                    }
                    {this.state.added == true && this.state.executed === false && this.state.data_upload == true && 
                        <button type="button" className="btn btn-primary" onClick={this.removeSegmentation}>Remove this prediction</button>
                    }


                </div>
                {this.state.executed === false && 
                <div className="col-6">
                    <div className={styles.align}>
                        <img className={styles.illustration} src={rfm_illustration} alt="sales forecasting image"/>
                    </div>
                            
                </div>} 
                
            </div>
            
        </div>

        

        
        );
    };
}   
export default Segmentation;