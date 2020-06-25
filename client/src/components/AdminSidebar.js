import React, { Component } from 'react';
import styles from '../css/SideBar.module.css';
import NavItem from './NavItem.js';
import homeIcon from '../images/home-icon.svg'
import custIcon from '../images/customer-icon.svg'
import actionIcon from '../images/action-icon.svg'
class AdminSideBar extends Component {

    constructor(){
        super()
        this.state = {
            selected: 'home'
        };
    }    


    render() {
        
        const prefix = '/admindashboard';
        const home = "Home";
        const home_link = prefix + "/";
        const customers = "Customers";
        const customerr_link = prefix + "/customers";
        const action = "Actions";
        const action_link = prefix + "/actions";
        
        return(
          <div className="sidebar">
            <ul className={styles.nav}>
                
              <li className={styles.nav_item}>
                <NavItem icon={homeIcon} text={home} link={home_link}/>
              </li>
              <li className={styles.nav_item}>
                <NavItem icon={custIcon} text={customers} link={customerr_link}/> 
              </li>
              <li className={styles.nav_item}>
                <NavItem icon={actionIcon} text={action} link={action_link}/> 
              </li>
              
            </ul>
          </div>
        );
    };
}
export default AdminSideBar;