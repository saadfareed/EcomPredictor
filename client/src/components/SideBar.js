import React, { Component } from 'react';
import styles from '../css/SideBar.module.css';
import NavItem from './NavItem.js';
import homeIcon from '../images/home-icon.svg'
import UploadDataIcon from '../images/uploaddata-icon.svg'
import salesForecastingIcon from '../images/sf-icon.svg'
import marketBasketIcon from '../images/mb-icon.svg'
import RFMIcon from '../images/s-icon.svg'
import CAIcon from '../images/ca-icon.svg'
import MRMIcon from '../images/mrm-icon.svg'
import ULMIcon from '../images/ulm-icon.svg'
import CLMIcon from '../images/clm-icon.svg'
import axios from 'axios';  
import Cookies from 'js-cookie'


import Skeleton from 'react-loading-skeleton';



class SideBar extends Component {
  constructor(props){
    super(props)
    this.state={
        free:false,
        basic:false,
        premium:false,
        checked:[],
        isLoading: true

    }
   
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
   
    })
    .catch(function (error) {
      if (error.response) {
       
        if(error.response.status==401){
          Cookies.remove('token')
            window.location.href=`/login`
            this.setState({
               isLoading:false})
        }
        
      }
    });
    axios.get('/api/findenableordisable',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            this.setState({
                checked:response.data.checked,
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
        
        const prefix = '/dashboard';
        const home = "Home";
        const home_link = prefix + "/";
        const uploaddata = "Upload Data";
        const uploaddata_link = prefix + "/uploadData";
        const action_1 = "Sales Forecasting";
        const action_1_link = prefix + "/salesForecasting"
        const action_2 = "Market Basket Analysis";
        const action_2_link = prefix + "/MarketBasketAnalysis"
        const action_3 = "Segmentation (RFM)";
        const action_3_link = prefix + "/Segmentation"
        const action_4 = "Churn Analysis";
        const action_4_link = prefix + "/ChurnAnalysis"

        const action_5 = "Customer Life TimeModeling";
        const action_5_link = prefix + "/CustomerLifeTimeModeling"
        const action_6 = "Market Response Modeling";
        const action_6_link = prefix + "/MarketResponseModeling"
        const action_7 = "Uplift Modeling";
        const action_7_link = prefix + "/UpliftModeling"
        console.log(this.state.text)


        if(this.state.isLoading){
          return(
            <div>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/> 
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              <span style={{margin: "0rem 1rem 1rem 2.5rem"}}><Skeleton width={30} height={20}/></span>
              <span style={{margin: "1rem 0"}}><Skeleton width={140} height={20}/></span>
              <br/>
              <br/>
              
            </div>
          )
        }

        return(
          <div className="sidebar">
            <ul className={styles.nav}>
              <li className={styles.nav_item}>
                <NavItem icon={homeIcon} text={home} link={home_link}/>
              </li>
              <li className={styles.nav_item}>
                <NavItem icon={UploadDataIcon} text={uploaddata} link={uploaddata_link}/> 
              </li>
              { this.state.checked[0]==true &&
              <li className={styles.nav_item}>
                <NavItem icon={salesForecastingIcon} text={action_1} link={action_1_link}/> 
              </li>
              }
              { this.state.checked[1]==true &&
              <li className={styles.nav_item}>
                <NavItem icon={marketBasketIcon} text={action_2} link={action_2_link}/> 
              </li>
              }
              {((this.state.basic==true || this.state.premium==true) && this.state.checked[2]==true ) &&
              <li className={styles.nav_item}>
                <NavItem icon={RFMIcon} text={action_3} link={action_3_link}/> 
              </li>
              }
              {this.state.premium==true && this.state.checked[3]==true &&
              <li className={styles.nav_item}>
                <NavItem icon={CAIcon} text={action_4} link={action_4_link}/> 
              </li>
              }
              {((this.state.basic==true || this.state.premium==true) && this.state.checked[4]==true) &&
              <li className={styles.nav_item}>
                <NavItem icon={CLMIcon} text={action_5} link={action_5_link}/> 
              </li>
              }
              {this.state.premium==true && this.state.checked[5]==true &&
              <li className={styles.nav_item}>
                <NavItem icon={MRMIcon} text={action_6} link={action_6_link}/> 
              </li>
              }
              {((this.state.basic==true || this.state.premium==true && this.state.checked[6]==true)) &&
              <li className={styles.nav_item}>
                <NavItem icon={ULMIcon} text={action_7} link={action_7_link}/> 
              </li>
              }

              
            </ul>
          </div>
        );
    };
}
export default SideBar;