import React, { Component } from 'react';
import styles from '../css/home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import Cookies from 'js-cookie' 

import Skeleton from 'react-loading-skeleton';



class Home extends Component {

    constructor(props){
        super(props)
        this.state = {
            startProcessing : 0,
            button_name : "Start Processing",
            sf: -1,
            mb: -1,
            rfm: -1,
            ltv:-1,
            ca:-1,
            mr:-1,
            ul:-1,
            sf_exe: 0,
            mb_exe:0,
            rfm_exe:0,
            ltv_exe:0,
            ca_exe:0,
            mr_exe:0,
            ul_exe:0,
            isLoading: true

        }
    }

    startProcessing = () => {
        this.setState({ 
            startProcessing: 1,
            button_name : "Working"
        });

        this.forceUpdate()
        axios.get('/api/start-processing',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
           
         });
            
    }

    componentDidMount(){
       
        this.loadData()
        this.intervalID = setInterval(this.loadData.bind(this), 5000);
      


    }
    componentWillUnmount() {
        /*
          stop getData() from continuing to run even
          after unmounting this component
        */
        clearInterval(this.intervalID);
      }
     loadData() {
      

        axios.get('/api/start-processing/view-actions',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            
            
            let a1 = response.data.sf;
            let a2 = response.data.mb;
            let a3 = response.data.rfm;
            let a4=response.data.ltv;
            let a5=response.data.ca;
            let a6=response.data.mr;
            let a7=response.data.ul;
           
            this.setState({
                
                sf: a1,
                mb: a2,
                rfm: a3,
                ltv:a4,
                ca:a5,
                mr:a6,
                ul:a7,
                sf_exe: response.data.a1_executed,
                mb_exe: response.data.a2_executed,
                rfm_exe: response.data.a3_executed,
                ltv_exe:response.data.a4_executed,
                ca_exe:response.data.a5_executed,
                mr_exe:response.data.a6_executed,
                ul_exe:response.data.a7_executed,
                isLoading: false
            });
           
            
        })
        .catch(function (error) {
            if (error.response) {
             
              if(error.response.status==401){
                Cookies.remove('token')
                  window.location.href=`/login`
                  
              }
              
            }
          });
    }
    refresh(){
        axios.get('/api/refresh',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                isLoading:false
            })
        })
        .catch(function (error) {
            if (error.response) {
             
              if(error.response.status==401){
                Cookies.remove('token')
                  window.location.href=`/login`
              }
              
            }
          });

    }

    
    

  render() {    
      
    if(this.state.isLoading){
        return(
          <div>
            
            <span style={{margin: "0rem 0rem 0rem 0rem"}}><Skeleton width={230} height={30}/></span>
            <br/>
            <br/>
            <br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={550} height={20}/></span>
            <br/>
            <br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={535} height={20}/></span>
            <br/>
            <br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={510} height={20}/></span>
            <br/>
            <br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={540} height={20}/></span>
            <br/>
            <br/>
            <br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={550} height={80}/></span>
            <br/><br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={550} height={80}/></span>
            <br/>
            <br/>
            <span style={{margin: "1rem 0"}}><Skeleton width={550} height={80}/></span>
        </div>
        )
    }
    return(

        <div>
            <div className={'row'}>
                <div className={'col-6'}>
                    
                    <div className={styles.heading}>Welcome User,</div>
                    { (this.state.sf == true || this.state.mb == true || this.state.rfm == true || this.state.ltv == true || this.state.ca == true || this.state.mr == true|| this.state.ul == true ) &&
                    <div className={styles.paragraph}>
                            Here's the list of predictions you have marked currently in the system
                    </div>}
                    { this.state.sf == false && this.state.mb == false && this.state.rfm == false && this.state.ltv == false && this.state.ca == false && this.state.mr == false && this.state.ul == false &&
                    <div className={styles.textCustom}>
                        <div className={styles.paragraph}>
                            Looks like you have currently no predicitons and recommendations in to generate.
                        </div>
                        <div>
                            Once You go through rows on left and mark them. You can click this button to generate a report showing results of each prediction and recommendation.
                        </div>
                    </div>}
                    
                    {this.state.sf == true &&
                    <div class="alert alert-primary" role="alert">
                        Sales Forecasting
                    </div>
                    }
                    {this.state.mb == true &&
                    <div class="alert alert-primary" role="alert">
                        Market Basket
                    </div>
                    }
                    {this.state.rfm == true &&
                    <div class="alert alert-primary" role="alert">
                        Segmentation
                    </div>
                    }
                    {this.state.ca == true &&
                        <div class="alert alert-primary" role="alert">
                           Churn Analysis
                        </div>
                        }
                    {this.state.ltv == true &&
                        <div class="alert alert-primary" role="alert">
                            CustomerLifeTimeModelling
                        </div>
                    }
                    {this.state.mr == true &&
                            <div class="alert alert-primary" role="alert">
                                MarketResponse Modelling
                            </div>
                    }
                    {this.state.ul == true &&
                        <div class="alert alert-primary" role="alert">
                            Uplift Modelling
                        </div>
                        }
                    
                    {this.state.sf_exe == true &&
                    <div className="alert alert-success" role="alert">
                        Sales Forecasting Processed successfully. Please check in respective tab.
                    </div>
                    }
                    {this.state.mb_exe == true &&
                    <div className="alert alert-success" role="alert">
                        Market Basket Processed successfully. Please check in respective tab.
                    </div>
                    }
                    {this.state.rfm_exe == true &&
                    <div className="alert alert-success" role="alert">
                        Segmentation (RFM) Processed successfully. Please check in respective tab.
                    </div>
                    }
                    {this.state.ca_exe == true &&
                        <div className="alert alert-success" role="alert">
                            Churn Analysis Processed successfully. Please check in respective tab.
                        </div>
                        }
                    {this.state.ltv_exe == true &&
                        <div className="alert alert-success" role="alert">
                        CustomerLifeTimeModelling Processed successfully. Please check in respective tab.
                        </div>
                        }
                    {this.state.mr_exe == true &&
                        <div className="alert alert-success" role="alert">
                            MarketResponse Modelling Processed successfully. Please check in respective tab.
                         </div>
                    }
                    {this.state.ul_exe == true &&
                         <div className="alert alert-success" role="alert">
                                Uplift Modelling Processed successfully. Please check in respective tab.
                        </div>
                    }
                    

                </div>
                <button type="button" className={'btn btn-primary btn-lg ml-5 mt-5 float-right'} onClick = {this.refresh}>Refresh</button>
                {(this.state.sf == true || this.state.mb==true || this.state.rfm==true || this.state.ltv==true || this.state.ca==true || this.state.mr==true || this.state.ul==true)  &&
                <div className={'col-6'}>
                    
                    <button type="button" className={'btn btn-primary btn-lg ml-5 mt-5 float-right'} onClick = {this.startProcessing}>{this.state.button_name}</button>
                </div>  }
                { this.state.startProcessing==true &&
                    <div className="alert alert-success" role="alert">
                        System has registored your input, check respective actions within few minutes.
                    </div>}
            </div>


        </div>
        
        
    );
  };
}
export default Home;