import React, { Component } from 'react';
import styles from '../css/mb.module.css';
import axios from 'axios';  
import clm_illustration from '../images/clm-illustration-1.svg'
import Cookies from 'js-cookie'
import {Pie} from 'react-chartjs-2';
import loader from '../images/loading2.gif'

class CustomerLifeTimeModeling extends Component {

    constructor(props){
        super(props)
        this.state = {
            added: -1,
            executed: 0,
            data_upload: -1 ,
            record:{},
            error:false,
            labels:['Low-Value','Mid-Value','High-Value'],
            
            datasets: [{
                  label: 'Pie chart',
                  data: [],
                  backgroundColor:['red','blue','green']
                  
            }],
            isLoading: true
        };
    }    

    addCustomerLifeTimeModeling = () => {
        axios.post('/api/lifetimemodelling/add','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }

    removeCustomerLifeTimeModeling = () => {
        axios.post('/api/lifetimemodelling/remove','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }
    downloadFile = () => {
        window.open('http://localhost:3000/api/lifetimemodelling/download','_current');
    }

    componentDidMount(){
        return axios.get('/api/lifetimemodelling/view',{headers: {token: Cookies.get('token')}})
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
        axios.get('/api/lifetimemodelling/plot-graph',{headers: {token: Cookies.get('token')}})
            .then(response => {
                this.state.datasets[0].data=response.data.val
                
                this.setState({
                    executed: true 
                });
            });


    }
    render() {
        if(this.state.executed){
            this.plotGraph();
        }
        if (this.state.isLoading){
            return(
                <div>
                    <img className={styles.loader}  src={loader} alt="loader"/>
                </div>
            )
        }



        return(     



            <div>
            <div className="row">

                { this.state.executed == true && this.state.error == false  &&
                <div className="col-12">
                    <div className={styles.first_heading}>
                    Customer LifeTime Modeling
                        
                    
                    </div>
                    <div className="row mt-2">
                        <div className="col-7">
                            <div className= {styles.paragraph}>
                                Results are evaluated succesfully. You can <b>click Download button</b> to see Customer LifeTime Modeling of the data u uploaded.
                            </div>
                            <button type="button" className="btn btn-success mt-3" onClick={this.downloadFile}>Download LTV.xlsx</button>
                        </div>
                    </div>

                    <div className="row">
                            <div className="col-4">
                                
                                <div className={styles.bubbleroot}>
                                    <div className={styles.bubbleitemcustom}>
                                        <div className={styles.rectengle1 + " mt-4"}>
                                            <div className={styles.content}>
                                                
                                                <div className= {styles.number}>{this.state.record.trainingAccuracy}</div>
                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={styles.bubbleitemcustom}>
                                        <div className={styles.rectengle1}>
                                            <div className={styles.content}>
                                                
                                                <div className= {styles.number}>{this.state.record.testAccuracy}</div>
                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="chart">
                                    <Pie
                                    width={6}
                                    height={6}
                                    labels='pie'
                                    data={{
                                        labels:this.state.labels,
                                        datasets:this.state.datasets}}
                                        height='4%'
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


                            </div>
                            
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
                        Customer LifeTime Modeling
                    </div> }

                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        Our automated predictor will be applying customer predictive lifetime modeling to find out the lifetime value of the customer. This would be done by fixing a time slot of the customer’s active period and predicting the next time slot. An LTV score would be used to train the model. The required attributes would be the same as for the segmentation of customers. We used ustomer segmentation as a feature set for this.
                        
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.paragraph}>
                        For this prediction to work, the following columns must be 
                        present In your excel file
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.cols}>
                        'customerid', 'invoicedate', 'quantity', 'unitprice'
                    </div>}
                    
                    
                    {this.state.added == false && this.state.executed === false && this.state.data_upload == true &&
                        <button type="button" className="btn btn-primary" onClick={this.addCustomerLifeTimeModeling}>Include this prediction</button>
                    }
                    {  this.state.executed == false && this.state.data_upload == false &&
                        <div className="alert alert-danger" role="alert">
                            Please upload data first to <b>"include this prediction"</b>
                        </div>
                    }
                    {this.state.added == true && this.state.executed === false &&this.state.data_upload == true &&
                        <button type="button" className="btn btn-primary" onClick={this.removeCustomerLifeTimeModeling}>Remove this prediction</button>
                    }


                </div>
                {this.state.executed === false && 
                <div className="col-6">
                    <div className={styles.align}>
                        <img className={styles.illustration} src={clm_illustration}/>
                    </div>
                            
                </div>}
                
            </div>
            
        </div>

        
        );
    };
}   
export default CustomerLifeTimeModeling;