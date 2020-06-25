import React, { Component } from 'react';
import styles from '../css/mb.module.css';
import axios from 'axios';  
import ulm_illustration from '../images/ulm-illustration.svg'
import Cookies from 'js-cookie'
import loader from '../images/loading2.gif'

class UpliftModeling extends Component {

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
    }    

    addMarketBasket = () => {
        axios.post('/api/uplift/add','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }
    downloadFile = () => {
        window.open('http://localhost:3000/api/uplift/download','_current');
    }

    removeMarketBasket = () => {
        axios.post('/api/uplift/remove','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }
  
    componentDidMount(){
        return axios.get('/api/uplift/view',{headers: {token: Cookies.get('token')}})
        .then(response => {
            
            const value = response.data.value;
            const executed = response.data.executed;
            
            this.setState({
                added: value,
                executed: executed,
                data_upload: response.data.data_upload,
                record:response.data.record,
                error:response.data.error,
                isLoading: false
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
                    Uplift Modeling
                    <button type="button" className="btn btn-success float-right" onClick={this.downloadFile.bind(this)}>Download UpliftModeling.xlsx</button>
                    </div>
                    
                    
                
                    <div className= {styles.paragraph}>
                    Results are evaluated succesfully.
                    </div>
                         
                   
                    <h5>We target customers below, who have uplift score greater than 3rd quantile</h5>
                    <div className={styles.bubbleroot}>
                            { this.state.record.Accuracy.map( (acc, i) =>
                                        ( acc != "" &&
                                            <div className={styles.bubbleitem}>
                                                <div className={styles.rectengle1}>
                                                    <div className={styles.content}>
                                                        {/* <div className={styles.text_value}>Total Customers</div> */}
                                                        <div className= {styles.number}>{acc}</div>
                                                        
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
                        Uplift Modeling
                    </div> }

                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        Our automated predictor will be using uplift modeling to predict the customers, which are beneficial, or not to include in a promotional campaign. For this, the system required three columns that are historical purchases by a customer, offers i.e., buy one get one free or some discount, and conversion (previous order detail). The system would predict the campaign, which gives the best order uplift and revenue uplift. The system will return a revenue of customers, who have an uplift score greater than third quantile and return an excel file of customers, which include the score of uplift for every customer.
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.paragraph}>
                        For this prediction to work, the following columns must be 
                        present In your excel file
                    </div>}
                    {this.state.executed === false && 
                    <div className={styles.cols}>
                        'history', 'offer', 'conversion'
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
                        <img className={styles.illustration} src={ulm_illustration}/>
                    </div>
                            
                </div>}
                
            </div>
            
        </div>

        
        );
    };
}   
export default UpliftModeling;