import React, { Component } from 'react';
import SideBar from './components/SideBar.js';
import { BrowserRouter as Router, Route ,Switch,Link,NavLink} from 'react-router-dom';
import Home from './components/Home.js';
import UploadData from './components/UploadData.js';
import SalesForecasting from './components/SalesForecasting.js';
import MarketBasket from './components/MarketBasket.js';
import Segmentation from './components/Segmentation.js';
import ChurnAnalysis from './components/ChurnAnalysis.js';
import ChangePlan from './components/ChangePlan.js'
import MRM from './components/MarketResponseModeling.js';
import CLM from './components/CustomerLifeTimeModeling.js';
import ULM from './components/UpliftModeling.js';
import profile from './components/Profile.js';
import styles from './css/dashboard.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/dashboard.css';

import profilePic from './images/profilePic.jpeg'
import Cookies from 'js-cookie'
import axios from 'axios';  
import LoadingBar from 'react-top-loading-bar';
import Skeleton from 'react-loading-skeleton';



class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
        firstname:"",
        lastname:"",
        isLoading:true,
        loadingBarProgress: 0
    };
    
  } 


  add = (value) =>  {
    this.setState({
      loadingBarProgress: this.state.loadingBarProgress + value
    });
  }

  onLoaderFinished = () => {
    this.setState({ loadingBarProgress: 0 });
  };

  
  logout = () => {

    this.add(30)
    
    Cookies.remove('token')
    window.location.href = `/login`;
    this.setState({
      loadingBarProgress: 100
    })
  }
  componentDidMount()
  {
     axios.get('/api/getCustomers/profileinfo',{headers: {token: Cookies.get('token')}})
    .then(response => {
        this.setState({
          firstname:response.data.profile.Firstname,
          lastname:response.data.profile.Lastname,
          isLoading:false
        })
     })
        
       
   
  }
  render() {




  return (
    <div className={styles.app}>
     
     <Router>
      <header className={styles.header}>
      <LoadingBar
                    progress={this.state.loadingBarProgress}
                    height={5}
                    color='yellow'
                    onLoaderFinished={() => this.onLoaderFinished()}
                    />
        <a href="/dashboard">
        <div className={styles.logo}>
          <svg width="257" height="54" viewBox="0 0 257 54">
              <defs>
                <clipPath id="clip-logo">
                  <rect width="257" height="54"/>
                </clipPath>
              </defs>
              <g id="logo" clipPath="url(#clip-logo)">
                <text id="EcomPredictor" transform="translate(4 45)" fill="#fff" fontSize="25" fontFamily="GlossAndBloom, Gloss And Bloom"><tspan x="0" y="0">EcomPredictor</tspan></text>
              </g>
          </svg>
        </div>
        </a>
        
        <div className={styles.logout}>
            <Router>
            <button type="button" className="btn btn-warning"><Link onClick={this.logout} to="/login" className={styles.bttn} >Logout</Link></button>
            </Router>
        </div>  
        <div className={styles.namePlusPic}>
          
          <div >
  <NavLink to="/dashboard/profile" className={styles.name}>{`${this.state.firstname}  ${this.state.lastname}`}</NavLink> 
          </div>
          
        </div>
        
        <div className={styles.changePlan}>
            
              <NavLink to="/dashboard/changeplan" className={styles.link} >Change Plan</NavLink>
            
        </div>
        
        
      </header>

       
        <div className={'container-fluid p-0 ' + styles.root}>
          

            <div className={styles.left_col}>
              <SideBar />
            </div>

            <div className={styles.right_col}>
              <div className={styles.r_box} >
                  
                <Switch>
                  
                    <Route path="/dashboard" exact component={Home}/>
                    <Route path="/dashboard/changeplan" exact component={ChangePlan}/>
                    <Route path="/dashboard/profile" exact component={profile}/>
                    <Route path="/dashboard/uploadData" exact component={UploadData}/>
                    <Route path="/dashboard/salesForecasting" exact component={SalesForecasting}/>
                    <Route path="/dashboard/MarketBasketAnalysis" exact component={MarketBasket}/>
                    <Route path="/dashboard/Segmentation" exact component={Segmentation}/>
                    <Route path="/dashboard/ChurnAnalysis" exact component={ChurnAnalysis}/>
                    <Route path="/dashboard/CustomerLifeTimeModeling" exact component={CLM}/>
                    <Route path="/dashboard/MarketResponseModeling" exact component={MRM}/>
                    <Route path="/dashboard/UpliftModeling" exact component={ULM}/>

                </Switch>
              </div>
              
            </div>


        </div>

        </Router>

    </div>
  );
  }
}

export default Dashboard;
