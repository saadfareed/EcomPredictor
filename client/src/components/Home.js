//All Imports
import React, { Component } from 'react';
import styles from '../css/home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import Cookies from 'js-cookie' 
import Skeleton from 'react-loading-skeleton';
import buffering from '../images/buffering.gif'




// Component Start
class Home extends Component {

    constructor(props){
        super(props)

        //States defined
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
            sf_err:false,
            mb_err:false,
            rfm_err:false,
            ltv_err:false,
            ca_err:false,
            mr_err:false,
            ul_err:false,
        
            isLoading: true,
            processing_status: false,
            refresh_loading: false,
            stp_btn: true

        }
    }




    // component method
    startProcessing = () => {

        this.setState({
            processing_status: true,
            
        })

        this.setState({ 
            startProcessing: 1,
            button_name : "Working",
            stp_btn:false
        });

        this.forceUpdate()
        axios.get('/api/start-processing',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            
         });
            
    }
    
    // component method
    componentDidMount(){
       
        this.loadData()

        // calling every 5 seconds
        this.intervalID = setInterval(this.loadData.bind(this), 5000);
      


    }
    componentWillUnmount() {
        
        clearInterval(this.intervalID);
    }

    // component method
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
            
            // setting response to states
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
                sf_err: response.data.a1_error,
                mb_err: response.data.a2_error,
                rfm_err: response.data.a3_error,
                ltv_err: response.data.a4_error,
                ca_err: response.data.a5_error,
                mr_err: response.data.a6_error,
                ul_err:response.data.a7_error,
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

    // Reset Button Method
    refresh = () => {

        this.setState({
            refresh_loading: true
        })

        
        axios.get('/api/refresh',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                isLoading:false
            })
            this.setState({
                refresh_loading: false
            })
        })
        .catch(function (error) {
            if (error.response) {
             
              if(error.response.status==401){
                Cookies.remove('token')
                  window.location.href=`/login`
              }
              this.setState({
                refresh_loading: false
              })
              
            }
        });

    }

    
    

  render() {    


    // Show Skeleton when its not loaded yet
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

    // show that then axios has returned response 
    // when all data is loaded
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
                    {this.state.sf_err == true &&
                        <div class="alert alert-danger" role="alert">
                        Sales Forecasting Error
                        </div>
                    }
                    
                    {this.state.mb_err == true &&
                        <div class="alert alert-danger" role="alert">
                            Market Basket error
                        </div>
                        }
                    
                   
                    {this.state.rfm_err == true &&
                        <div class="alert alert-danger" role="alert">
                            Segmentation error
                        </div>
                        }
                    
                        {this.state.ca_err == true &&
                            <div class="alert alert-danger" role="alert">
                            Churn Analysis error
                            </div>
                            }
                    
                    {this.state.ltv_err == true &&
                        <div class="alert alert-danger" role="alert">
                            CustomerLifeTimeModelling error
                        </div>
                    }
                    
                    {this.state.mr_err == true &&
                        <div class="alert alert-danger" role="alert">
                        MarketResponse Modelling error
                        </div>
                    }
                    
                    {this.state.ul_err == true &&
                            <div class="alert alert-danger" role="alert">
                                Uplift Modelling Error
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
                    { this.state.startProcessing==true &&
                    <div className="alert alert-success" role="alert">  
                        System has registored your input, check respective actions within few minutes.
                    </div>}

                </div>
                <div className="col-6 ">
                    <div className="float-right">
                        {this.state.stp_btn== true && (this.state.sf == true || this.state.mb==true || this.state.rfm==true || this.state.ltv==true || this.state.ca==true || this.state.mr==true || this.state.ul==true)  &&
                        <div className={styles.a}
                        >
                            
                            <button type="button" className={'btn btn-primary ml-3 mt-5 '} onClick = {this.startProcessing}>Start Processing</button>
                        </div>  }

                        
                        <button type="button" className={'btn btn-primary ml-2 mt-5 '} onClick = {this.refresh}>Reset Account</button>
                        { this.state.refresh_loading==true &&
                            <img src={buffering} className={styles.b} alt=""/>
                        }   
                        
                    </div>
                    { this.state.startProcessing==true &&
                    <div className="alert alert-success mt-3" role="alert">  
                        Scripts have started executing, We will keep notifying you on left side. 
                    </div>}
                   
                        
                    
                </div>
                
                
               
                
            </div>


        </div>
        
        
    );
  };
}
export default Home;