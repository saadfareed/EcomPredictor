import React, { Component } from 'react';
import styles from '../css/mb.module.css';
import axios from 'axios';  
import ca_illustration from '../images/ca-illustration.svg'
import Cookies from 'js-cookie'
import loader from '../images/loading2.gif'
class ChurnAnalysis extends Component {

    constructor(props){
        super(props)
        this.state = {
            added: -1,
            executed: 0,
            data_upload: -1 ,
            record:{},
            error:false,
            isLoading: true
        };
    }    s

    addMarketBasket = () => {
        axios.post('/api/churn-analysis/add','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }

    removeMarketBasket = () => {
        axios.post('/api/churn-analysis/remove','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }
    downloadFile = () => {
        window.open('http://localhost:3000/api/churn-analysis/download','_current');
    }

    componentDidMount(){
        return axios.get('/api/churn-analysis/view',{headers: {token: Cookies.get('token')}})
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
    render() {


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

            { 
                this.state.executed == true && this.state.error == false  &&
                <div className="col-12">
                    <div className={styles.first_heading}>
                    Churn Analysis
                        
                    </div>
                    
                
                    <div className= {styles.paragraph}>
                    Results are evaluated succesfully. 
                    </div>
                         
                   

                    <div className={styles.bubbleroot}>
                            { this.state.record.metrics.map( (matrix, i) =>
                                        ( matrix != "" &&
                                            <div className={styles.bubbleitem}>
                                                <div className={styles.rectengle1}>
                                                    <div className={styles.content}>
                                                        {/* <div className={styles.text_value}>Total Customers</div> */}
                                                        <div className= {styles.number}>{matrix}</div>
                                                        
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        )
                                )
                            }
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
                        Churn Analysis
                    </div> }

                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        
                        This prediction basically applies CA technique
                        based on the two following attributes
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
                        <button type="button" className="btn btn-primary" onClick={this.addMarketBasket}>Include this prediction</button>
                    }
                    {  this.state.executed == false && this.state.data_upload == false &&
                        <div className="alert alert-danger" role="alert">
                            Please upload data first to <b>"include this prediction"</b>
                        </div>
                    }
                    {this.state.added == true && this.state.executed === false &&this.state.data_upload == true &&
                        <button type="button" className="btn btn-primary" onClick={this.removeMarketBasket}>Remove this prediction</button>
                    }


                </div>
                {this.state.executed === false && 
                <div className="col-6">
                    <div className={styles.align}>
                        <img className={styles.illustration} src={ca_illustration}/>
                    </div>
                            
                </div>}
                
            </div>
            
        </div>

        
        );
    };
}   
export default ChurnAnalysis;