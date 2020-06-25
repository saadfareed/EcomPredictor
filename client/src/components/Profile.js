import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pform from './pform.js'

import styles from '../css/sf.module.css';


class Profile extends Component {
  

    render() {
        return (
         <div>
             <div className={styles.first_heading}>
                       My Profile
            </div>

            

            <Pform/>

         </div>
        );
    }



}
export default Profile;