import React, { Component } from 'react';
import styles from '../css/mb.module.css';
import axios from 'axios';  
import mb_illustration from '../images/mb-illustration.svg'
import Cookies from 'js-cookie'
import loader from '../images/loading2.gif'
class MarketBasket extends Component {

    constructor(props){
        super(props)
        this.state = {
            added: -1,
            executed: 0,
            data_upload: -1 ,
            record:{},
            error:false,
            isLoading:true
        };
    }    

    addMarketBasket = () => {
        axios.post('/api/market-basket/add','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }

    removeMarketBasket = () => {
        axios.post('/api/market-basket/remove','',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                added: response.data.added,
                
            });
            this.forceUpdate();
        });
    }
    downloadFile = () => {
        window.open('http://localhost:3000/api/market-basket/download','_current');
    }

    componentDidMount(){
        return axios.get('/api/market-basket/view',{headers: {token: Cookies.get('token')}})
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

                { this.state.executed == true && this.state.error == false  &&
                <div className="col-12">
                    <div className={styles.first_heading}>
                        Market Basket Analysis
                        
                    </div>
                    <div className="row mt-5">
                        <div className="col-7">
                            <div className= {styles.paragraph}>
                                Results are evaluated succesfully. You can <b>click Download button</b> to see Market Basket Analysis of the data u uploaded.
                            </div>
                            <button type="button" className="btn btn-success mt-3" onClick={this.downloadFile}>Download FPgrowth.xlsx</button>
                        </div>
                    </div>
                    

                </div>    
                }
                { this.state.executed == false && this.state.error == true  &&
                
                    <div class="alert alert-warning mb-3" role="alert">
                        <p>Every Prediction has a required set of columns that needs to be there in order to perform it.</p>
                        However, We did not find the following columns in your uploaded dataset: 
                        <div class="alert alert-danger mt-3"><b>{this.state.record.error}</b></div>
                        <b>Tip: </b>Make sure to match spellings, case and upload again.
                    
                  </div>
                }
                <div className="col-6">
                    {this.state.executed === false &&
                    <div className={styles.first_heading}>
                        Market Basket Analysis
                    </div> }

                    {this.state.executed === false && 
                    <div className= {styles.paragraph}>
                        The underlying algorithm used for the Market basket analysis is the frequent pattern growth method, this is also termed as the data association rule in the field of data mining. The FP growth method used in her not only finds the most closely associated products but it also finds them efficiently.
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
                        <img className={styles.illustration} src={mb_illustration} alt="sales forecasting image"/>
                    </div>
                            
                </div>}
                
            </div>
            
        </div>

        
        );
    };
}   
export default MarketBasket;