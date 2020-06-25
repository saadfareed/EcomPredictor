import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';  
import styles from '../css/SignUp.module.css'
import Cookies from 'js-cookie'
import LoadingBar from 'react-top-loading-bar';
import buffering from '../images/buffering.gif' 
import { NotificationContainer, NotificationManager } from 'react-notifications';

class ResetPass extends Component {

    constructor(props){
        super(props)
        this.state={
            linkDate:"",id:"",password: "",confirm_password: "", errors: {},
            loadingBarProgress: 0,
            buffering: false
        }
    }
    componentDidMount() {
        let slugParam = this.props.match.params.slug;
        let splitSlug=slugParam.split("+++");
        let reqDate=splitSlug[0];
        let id=splitSlug[1];
        this.setState({id:id,linkDate:reqDate});
        let date1 = new Date(reqDate);
        let currentDate = new Date();
        let differenceinMS = currentDate - date1
        
        if (differenceinMS > 180000) {
            NotificationManager.error("Link Not Valid link will be valid for 3 min.Please sent the reset link Again");
            this.props.history.push("/login");
        }
    }
    changehandler=(e)=>{
      
        this.setState({[e.target.name]:e.target.value})
    }
    
    reset() {
      
      
        if (this.state.id == '') {
            NotificationManager.warning("id is Required");
            return false;
        }
        else if (this.state.password == ''||this.state.confirm_password == '' ) {
            
            const error={
                password:"password is Required"
            }
            this.setState({errors:error})
            
           // return false;
        }
        else if (this.state.password != this.state.confirm_password) {
           
            const error={
                password:"password dont match"
            }
            this.setState({errors:error})
            //return false;
        }
        else{
        // const data = { email: this.state.email, };
        // console.log(data)
       
        axios
            .post("/api/password/updatePassword", this.state)
            .then(result => {
              //  NotificationManager.success(result.data.msg);
                const error={
                    password:result.data.msg
                }
                this.setState({errors:error})
            })
            .catch(err => {
                if (err.response && err.response.status === 404)
                    NotificationManager.error(err.response.data.msg);
                else
                    NotificationManager.error("Something Went Wrong");
                this.setState({ errors: err.response })
            });
        }

    }





  render() { 
      return(
        

        <div className="container">


            <div className={styles.bgBlack}>
                    <div className="row">
                    <LoadingBar
                    progress={this.state.loadingBarProgress}
                    height={5}
                    color='yellow'
                    onLoaderFinished={() => this.onLoaderFinished()}
                    />
                            <div className="col-md-8 m-auto">
                                <div className={styles.logo}>
                                    <svg width="257" height="54" viewBox="0 0 173 54">
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

                               
                                <p className="lead text">Enter your new password. Make sure you remember this time</p>
                                <form className="needs-validation" novalidate>
                                    
                                    <div className="form-group">
                                        <label >Password</label>
                                        <input name="password" type="password" className="form-control" value={this.state.password} onChange={this.changehandler}    placeholder="Password" required/>
                                        
                                    </div>
                                    <div className="form-group">
                                        <label > Confirm Password</label>
                                        <input name="confirm_password" type="password" className="form-control" value={this.state.confirm_password} onChange={this.changehandler}     placeholder="Confirm password" required/>

                                        
                                    </div>
                                    

                                   
                                </form>
                                <button className="btn btn-primary" onClick={this.reset.bind(this)}>Reset</button>
                                    {this.state.errors.password ? 
                                        <div className='alert alert-primary mt-3'>{this.state.errors.password}</div>:null} 
                                
                            </div>
                    </div>
            </div>

        </div>
      );
  }
      
}

export default ResetPass;