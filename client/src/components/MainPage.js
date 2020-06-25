import React, { Component } from 'react';
import styles from '../css/mp.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import logo from '../images/logo.svg'
import whiteBlob from '../images/white-blob.svg'
import glowBlob from '../images/glow-blob.png'
import glowBlobBlue from '../images/blue-glow-blob.png'
import blueBlob from '../images/blue-blob.svg'
import img1 from '../images/img-1.svg'
import wb2 from '../images/whiteb2.svg'


class MainPage extends Component {


    render(){

        return (
            <div>
                
                <div className="container">
                    <div >
                        <img className={ styles.logo+" brand"} src={logo} alt=""/>
                    </div>
                    

                    <div className="row">
                        <div className="col-6">
                            <h2 className={styles.heading}>View Customer Insights</h2>
                            <h2 className={styles.heading}>Like Never Before</h2>

                            <p className={styles.para}>
                                Your Store's data contain useful information.
                                We run modern data science scripts on it to
                                extract meaningful insights and do predictions
                            </p>

                            <div className="mt-5">
                                <a href="/signup"><button type="button" class={styles.hlghtBtn + " btn btn-outline-primary"}>Join Our Platform</button></a>
                                <a href="/login"><button type="button" class={styles.normalbtn + " ml-3 btn btn-outline-primary"}>Sign In</button></a>
                            </div>

                            
                        </div>
                        <div className="col-6">
                            <img className={styles.img1} src={img1} alt=""/>
                            <img className={styles.whiteBlob} src={whiteBlob} alt=""/>
                            <img className={styles.glowBlob} src={glowBlob} alt=""/>
                            <img className={styles.glowBlobBlue} src={glowBlobBlue} alt=""/>
                            <img className={styles.blueBlob} src={blueBlob} alt=""/>
                            
                        </div>

                    </div>
                    

                    
                </div>
                
                <img className={styles.wb2} src={wb2} alt=""/>
            </div>
        )
    };


}
export default MainPage ;