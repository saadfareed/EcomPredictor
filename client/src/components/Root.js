
// all imports
import React, { Component } from 'react';
import { ProtectedRoute } from "./protected";
import { ProtectedRouteAdmin } from "./ProtectedAdmin";
import styles from '../css/root.module.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
import SignUp from './SignUp';
import Dashboard from '../Dashboard';
import Login from './Login';
import SalesForecasting from './SalesForecasting';
import UploadData from './UploadData';
import AdminLogin from './AdminLogin';
import AdminDasboard from './AdminDashboard';
import AdminHome from './AdminHome';
import actions from './Actions'
import ChangePlan from './ChangePlan'
import '../css/root.css'
import ResetPass from './ResetPass.js';
import MainPage from './MainPage.js'


// component starts
class Root extends Component {

    constructor(props){

        super(props)
        this.state = {

        }

    }

  // defined routes for frontend 
  render() {    
    return(

      <div>
          <div className="message">
              Not available for small devices.
          </div>

          <div className="content">
              <Router>
                  <Switch>
                      <Route path='/' exact component={MainPage} />
                      
                      <Route path='/signup' exact component={SignUp} />
                      <Route path='/login' exact component={Login} />
                      <Route path='/adminlogin' exact component={AdminLogin} />
                      
                      <Route path="/change-password/:slug" component={ResetPass} />

                      <ProtectedRoute path='/dashboard' exact component={Dashboard} />
                    

                      <ProtectedRouteAdmin path='/admindashboard' exact component={AdminDasboard} />
                      <ProtectedRouteAdmin path='/admindashboard/customers' exact component={AdminDasboard} />
                      <ProtectedRouteAdmin path='/admindashboard/actions' exact component={AdminDasboard} />
                      
                  </Switch>        
              </Router>

          </div>


      </div>
     
        
    );
  };
}

export default Root;