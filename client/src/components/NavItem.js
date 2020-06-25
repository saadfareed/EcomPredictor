import React, { Component } from 'react';
import styles from '../css/NavItem.module.css';

import {
    BrowserRouter as Router,
   
    Link,
   
  } from "react-router-dom";
class NavItem extends Component {

    constructor(props){
        super(props)

    }

    

  render() {
    
    return(
        
        <Link to={this.props.link}>
            <div className={styles.nav_item}>
                <div className={'row'}>
                    <div className={styles.icon}>
                        <div className={styles.icon}>
                            <img src={this.props.icon} alt=""/>
                        </div>
                    </div>
                    <div className='col-8'>
                        {this.props.text}
                    </div>
                </div>
                
            </div>
        </Link>
        
    );
  };
}
export default NavItem;