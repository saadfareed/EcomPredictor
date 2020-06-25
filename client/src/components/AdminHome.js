import React, { Component } from 'react';
import styles from '../css/home.module.css';
import '../css/home.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import Cookies from 'js-cookie' 
import { Route, Redirect } from "react-router-dom";


import Skeleton from 'react-loading-skeleton';

class AdminHome extends Component {
    constructor(props) {
        super(props);
        this.state={
            count:0,
            enable:0,
            disable:0,
            most:'',
            least:'',
            revenue:[0,0,0],
            isLoading:true
            }

    }
    componentDidMount(){
        axios.get('/api/stats',{headers: {token: Cookies.get('adtoken')}})
        .then(response=>{
            this.setState({
                count:response.data.count,
               enable:response.data.enable,
               disable:response.data.disable,
                most:response.data.most,
              least:response.data.least,
              revenue:response.data.revenue,
               isLoading:false
            })
            
        })
        .catch(function (error) {
            if (error.response) {
             
              if(error.response.status==401){
                Cookies.remove('adtoken')
                  window.location.href=`/adminlogin`
              }
              
            }
          });
        
    }

    

    render() {
        
        if (this.state.isLoading){
            return(
                <div>
                    <span   >{<Skeleton width={600} height={30}/>} </span>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150} /></span>

                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    <br/>
                    <br/>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    <span className={styles.marg}><Skeleton className={styles.radius} width={240} height={150}/> </span>
                    
                </div>
            )
        }

        return (
            <div>
               <div className= "container">
                    <div className= {styles.heading1}>Welcome Admin</div>
                    <div className= {styles.paragraph1}>    -Here's latest stats of the system</div>
                    
                    <div className='row mt-5 mb-4'>
                        <div className='col-3'>
                            <div className={styles.rectengle1}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>Total Customers</div>
                                    <div className= {styles.number}>{this.state.count}</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className={styles.rectengle2}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>Action Activated</div>
                                    <div className= {styles.number}>{this.state.enable}</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className={styles.rectengle3}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>Disabled Actions</div>
                                    <div className= {styles.number}>{this.state.disable}</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className={styles.rectengle4}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>Total Reveneue</div>
                                    <div className= {styles.number}>${this.state.revenue[2]}</div>
                                </div>
                                
                            </div>
                        </div>


                    </div>

                    <div className='row mb-4'>
                        <div className='col-3'>
                            <div className={styles.rectengle4}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}> All Time Most Used Prediction</div>
                                    <div className= {styles.value}>{this.state.most}</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className={styles.rectengle3}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>All Time Least Used Prediction</div>
                                    <div className= {styles.value}>{this.state.least}</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className={styles.rectengle2}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>Basic Plan Revenue</div>
                                    <div className= {styles.number}>${this.state.revenue[0]}</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className={styles.rectengle1}>
                                <div className={styles.content}>
                                    <div className={styles.text_value}>Premium Plan Revenue</div>
                                    <div className= {styles.number}>${this.state.revenue[1]}</div>
                                </div>
                                
                            </div>
                        </div>


                    </div>






                    
                    



               </div>
               
               




            </div>
        );
    }
}



export default AdminHome;