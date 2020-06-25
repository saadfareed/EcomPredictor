import React, { Component } from 'react';
import styles from '../css/mb.module.css';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie'
import StripeCheckout from 'react-stripe-checkout'
import Skeleton from 'react-loading-skeleton';



class ChangePlan extends Component {

    constructor(props){
        super(props)
        this.state={
            free:false,
            basic:false,
            premium:false,
            isLoading: true

        }
    }   
    makePayment=token=>{
        console.log(token)
      
        
        const body={
            token,
            amount:5000
        }
      
        axios.post("/api/payment",body,{headers: {token: Cookies.get('token')}})
        .then(response => {
            
         if(response.data.check==true){
             this.setState({basic:true,free:false,premium:false})
             //new SideBar().updateState("ok")
            // this.sideBar.doThis()
            window.location.href=`/dashboard`
           // this.props.history.push('/dashboard');
           
            

         }
          

        })
        .catch(error => {
            console.log(error)
        })

        
    }
    makePayment1=token=>{
       
      
        
        const body={
            token,
            amount:10000
        }
      
        axios.post("/api/payment",body,{headers: {token: Cookies.get('token')}})
        .then(response => {
            
         if(response.data.check==true){

             this.setState({basic:false,free:false,premium:true})
             window.location.href=`/dashboard`
           
           
          
           

         }
          

        })
        .catch(error => {
            console.log(error)
        })


    }

    componentDidMount(){
        axios.get('/api/findplan',{headers: {token: Cookies.get('token')}})
        .then(response => {
            
           if(response.data.plan=="Free"){
               this.setState({free:true})
           }
           else if(response.data.plan=="Basic"){
            this.setState({basic:true})
           }
           else if(response.data.plan=="Premium"){
            this.setState({premium:true})
           }
           this.setState({
               isLoading: false
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
                     <span style={{display: "block" }}>{<Skeleton width={300} height={30}/>} </span>
                     <br/>
                     <span style={{display: "block"} }>{<Skeleton width={400} height={30}/>} </span>
                     <br/>
                     <br/>
                     <br/>
                    
                    <div className="row">
                        <div className="col-4">
                            <span style={{display: "block" }}>{<Skeleton width={300} height={400}/>} </span>
                        </div>
                        <div className="col-4">
                            <span style={{display: "block" }}>{<Skeleton width={300} height={400}/>} </span>
                        </div>
                        <div className="col-4">
                            <span style={{display: "block" }}>{<Skeleton width={300} height={400}/>} </span>
                        </div>
                        
                    </div>
                     

                </div>
            )
        }

        return(     
            
            <div>
             
                
                <div className={styles.first_heading}>
                        Change Your Plan
                </div> 
                <div className= {styles.paragraph}>
                        Every plan comes with different packages, which are detailed below: 

                </div>

                <div className="row">
                    { this.state.free===true &&
                    <div className="col-4">
                        <div className={styles.selected}>
                            <div className={styles.pacakge_name_selected}>
                                Free
                            </div>
                            <div className={styles.price}>
                                $0.00
                                <div className={styles.year}>
                                billed once
                                </div>
                            </div>
                            <div className={styles.pacakge_text}>
                                This Package includes: 
                            </div>
                            
                            <div className={styles.paragraph}>
                                <ul>
                                    <li>Sales forecasting</li>
                                    <li>Market Basket</li>
                                </ul>
                            </div>

                            <div className={styles.currentbtn}>
                            Current Plan
                            </div>
                        
                        </div>
                    </div>
                    }

                    { this.state.free===false &&
                    <div className="col-4">
                        <div className={styles.box}>
                            <div className={styles.pacakge_name}>
                                Free
                            </div>
                            <div className={styles.price}>
                                $0.00
                                <div className={styles.year}>
                                billed once
                                </div>
                            </div>
                            <div className={styles.pacakge_text}>
                                This Package includes: 
                            </div>
                            
                            <div className={styles.paragraph}>
                                <ul>
                                    <li>Sales forecasting</li>
                                    <li>Market Basket</li>
                                </ul>
                            </div>

                           
                        
                        </div>
                    </div>
                    }



                    { this.state.basic===true &&
                        <div className="col-4">
                            <div className={styles.selected}>
                            
                                <div className={styles.pacakge_name_selected}>
                                    Basic
                                </div>
                                <div className={styles.price}>
                                    $49.99
                                    <div className={styles.year}>
                                    billed once
                                    </div>
                                </div>
                                <div className={styles.pacakge_text}>
                                    This Package includes: 
                                </div>
                                
                                <div className={styles.paragraph}>
                                    <ul>
                                        <li>Sales forecasting</li>
                                        <li>Market Basket</li>
                                        <li>RFM Segmentation</li>
                                        <li>Uplift Modeling</li>
                                        <li>Customer LifeTime Modeling</li>
                                    </ul>
                                </div>
    
                                <div className={styles.currentbtn}>
                            Current Plan
                            </div>
                            
                            
                            </div>
                        </div>
                        }
                    { this.state.basic===false &&
                    <div className="col-4">
                        <div className={styles.box}>
                        
                            <div className={styles.pacakge_name}>
                                Basic
                            </div>
                            <div className={styles.price}>
                                $49.99
                                <div className={styles.year}>
                                billed once
                                </div>
                            </div>
                            <div className={styles.pacakge_text}>
                                This Package includes: 
                            </div>
                            
                            <div className={styles.paragraph}>
                                <ul>
                                    <li>Sales forecasting</li>
                                    <li>Market Basket</li>
                                    <li>RFM Segmentation</li>
                                    <li>Uplift Modeling</li>
                                    <li>Customer LifeTime Modeling</li>
                                </ul>
                            </div>
                            {this.state.free==true &&
                            <div className={styles.otherbtn}>
                                 <StripeCheckout stripeKey={process.env.REACT_APP_KEY} name="Basic Service" token={this.makePayment}>
                                 <button className={'btn btn-warning ' + styles.supercool}>I want this Package</button>
                             

                                </StripeCheckout>
                            </div>
                            }
                        
                        
                        </div>
                    </div>
                    }




                    { this.state.premium===true &&
                    <div className="col-4">
                    <div className={styles.selected}>
                        
                        <div className={styles.pacakge_name_selected}>
                            Premium
                        </div>
                        <div className={styles.price}>
                            $99.99
                            <div className={styles.year}>
                            billed once
                            </div>
                        </div>
                        <div className={styles.pacakge_text}>
                            This Package includes: 
                        </div>
                        
                        <div className={styles.paragraph}>
                            <ul>
                                <li>Sales forecasting</li>
                                <li>Market Basket</li>
                                <li>RFM Segmentation</li>
                                <li>Uplift Modeling</li>
                                <li>Customer LifeTime Modeling</li>
                                <li>Churn Analysis</li>
                                <li>Market Response Modeling</li>
                            </ul>
                        </div>

                       <div className={styles.currentbtn}>
                            Current Plan
                            </div>
                    
                    
                    </div>
                    </div>

                    }
                    { this.state.premium===false &&
                    <div className="col-4">
                    <div className={styles.box}>
                        
                        <div className={styles.pacakge_name}>
                            Premium
                        </div>
                        <div className={styles.price}>
                            $99.99
                            <div className={styles.year}>
                            billed once
                            </div>
                        </div>
                        <div className={styles.pacakge_text}>
                            This Package includes: 
                        </div>
                        
                        <div className={styles.paragraph}>
                            <ul>
                                <li>Sales forecasting</li>
                                <li>Market Basket</li>
                                <li>RFM Segmentation</li>
                                <li>Uplift Modeling</li>
                                <li>Customer LifeTime Modeling</li>
                                <li>Churn Analysis</li>
                                <li>Market Response Modeling</li>
                            </ul>
                        </div>
                         {(this.state.free==true || this.state.basic==true) && 
                        <div className={styles.otherbtn}>
                        <StripeCheckout stripeKey={process.env.REACT_APP_KEY} name="Premium Service" token={this.makePayment1}>
                        <button className={'btn btn-warning ' + styles.supercool}>I want this Package</button>
                    

                       </StripeCheckout>
                        </div>
                         }
                    
                    
                    </div>
                    </div>

                    }
                </div>
                    
                

            </div>
       
        
        );
    };
}   
export default ChangePlan;