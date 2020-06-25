import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';  
import styles from '../css/SignUp.module.css'
import Cookies from 'js-cookie'
import LoadingBar from 'react-top-loading-bar';
import buffering from '../images/buffering.gif' 
class SignUp extends Component {

    constructor(props){
        super(props)
        this.state={
            fname: '',
            lname: '',
            email: '',
            password: '',
            errors:{},
            loadingBarProgress: 0,
            buffering: false
        }
    }






     
    add = (value) =>  {
        this.setState({
        loadingBarProgress: this.state.loadingBarProgress + value
        });
    }

    onLoaderFinished = () => {
        this.setState({ loadingBarProgress: 0 });
    };


    submitForm=(e)=>{
        this.setState({
            buffering:true
        })

        this.add(60)
        e.preventDefault()
        axios.post("/api/signup/registor", this.state)
                .then(response => {
                    if(response.data.errors==undefined){
                        this.setState({
                            loadingBarProgress: 100,
                            buffering:false
                        })
                        window.location.href = `/login`;
                        
                    }
                    else{
                        this.setState({
                            loadingBarProgress: 0,
                            buffering:false
                            
                        })
                        this.setState({errors:response.data.errors})
                        
                    }
                  
                });

     }

    changehandler=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }

  render() { 
      
      
    if(Cookies.get('token'))
        {
            
            window.location.href = `/dashboard`;
          
        }

    if(!Cookies.get('token'))
    {
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

                                    <h1 className={styles.heading}>Create Your Account</h1>
                                    <p className="lead text-center">Registor to explore our latest python scripts</p>
                                    <form className="needs-validation" novalidate onSubmit={this.submitForm}>
                                        <div className="form-group pt-2">
                                            <label >First Name</label>
                                            <input name="fname" type="fname" className="form-control"  onChange={this.changehandler} value={this.state.fname}   placeholder="Enter first name" required/>
                                            
                                            
                                        </div>
                                        <div className="form-group">
                                            <label >Last Name</label>
                                            <input name="lname" type="lname" className="form-control"  onChange={this.changehandler} value={this.state.lname} placeholder="Enter last name" required/>
                                            
                                        </div>


                                        <div className="form-group">
                                            <label >Email address</label>
                                            <input name="email" type="email" className="form-control" onChange={this.changehandler} value={this.state.email}  placeholder="Enter email" required/>
                                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                            
                                        </div>
                                        <div className="form-group">
                                            <label >Password</label>
                                            <input name="password" type="password" className="form-control"  onChange={this.changehandler} value={this.state.password} placeholder="Password" required/>
                                            
                                        </div>
                                        {this.state.errors.Firstname ? 
                                                <div className='alert alert-danger mt-1'>{this.state.errors.Firstname}</div>:null}
                                        {this.state.errors.Lastname ? 
                                                <div className='alert alert-danger mt-1'>{this.state.errors.Lastname}</div>:null}
                                        {this.state.errors.email ? 
                                                <div className='alert alert-danger mt-1'>{this.state.errors.email}</div>:null}
                                        {this.state.errors.Password? 
                                                <div className='alert alert-danger mt-1'>{this.state.errors.Password}</div>:null}
                                        <a style={{display: "block"}} href="/login" className={styles.link+ ' mb-1'}>Already have an Account?</a>
                                        <input style={{display: "inline"}} type="submit" className="btn btn-primary"/>

                                        {this.state.buffering && 
                                        <img className={styles.buffer + " ml-2"} src={buffering} alt=""/>}
                                    </form>
                                    
                                </div>
                        </div>
                </div>


                
                    
                
            </div>
            
        );
    }
  };
}


export default SignUp;