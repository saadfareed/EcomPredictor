import React from 'react';
import AdminSideBar from './AdminSidebar';
import { BrowserRouter as Router, Route ,Switch,Link} from 'react-router-dom';
import AdminHome from './AdminHome';
import customers from './Customers'
import actions from './Actions'
import styles from '../css/admindashboard.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import profilePic from '../images/profilePic.jpeg'
import Cookies from 'js-cookie'


function AdminDashboard() {

  




  function logout(){
    
    Cookies.remove('adtoken')
    window.location.href = `/adminlogin`;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a href="/admindashboard"><div className={styles.logo}>
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
            <button type="button" class="btn btn-warning"><Link onClick={logout} to="/adminlogin"  className={styles.link} >Logout</Link></button>
            </Router>
        </div>  
        <div className={styles.namePlusPic}>
          <div className={styles.name}>
            Admin
          </div>
          
        </div>
        
        
      </header>


      <div className={'container-fluid p-0 ' + styles.root}>
        <Router>

          <div className={styles.left_col}>
            <AdminSideBar />
          </div>

          <div className={styles.right_col}>
            <div className={styles.r_box} >
                
              
              <Switch>
                  <Route path="/admindashboard" exact component={AdminHome}/>
                  <Route path="/admindashboard/customers" exact component={customers}/>
                  <Route path="/admindashboard/actions" exact component={actions}/>
              </Switch>
            </div>
            
          </div>

        </Router>


      </div>

    </div>
  );
}

export default AdminDashboard;
