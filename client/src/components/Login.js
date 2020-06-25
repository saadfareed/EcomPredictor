import React,{Component} from 'react'
import axios from "axios";
import Cookies from 'js-cookie'
import styles from '../css/login.module.css';
import LoadingBar from 'react-top-loading-bar';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';

class Login extends Component{

    constructor(props){
        super(props)
        this.state={
            email:'',
            password:'',
            errors:{},
            loadingBarProgress: 0,
            forgot_pass: false,
            button_msg: "Forgot Password? ",
            femail:'',
            ferror:{},
            isLoading: true
        }
        

    }
    send()
    {
        if(this.state.femail=='')
        {
            const er={
                email:"email is required"
            }
            
            this.setState({ferror:er})
            
        }
        if(this.state.femail!=''){
        axios.post("/api/password/reset",this.state)
		.then(response => {
            if(response.data.check==true){
               
               swal("Email sent!", "", "success");
               //this.setState({msg:'',subject:'',error:{}})
               this.setState({ferror:{}})
               swal("Email sent!", "", "success");

            }
            else if(response.data.check==false){
               // swal("Invalid email adress!", "", "error");
               
              
              const er={
                email:"email is invalid"
            }
            
            this.setState({ferror:er})

            }
			
		  
			
            


        })
       
       
           
       
        }


    }

    componentWillMount(){
        
    }

    
    add = (value) =>  {
        this.setState({
        loadingBarProgress: this.state.loadingBarProgress + value
        });
    }

    onLoaderFinished = () => {
        this.setState({ loadingBarProgress: 0 });
    };

  

    changehandler=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    
    submithandler=(e)=>{
        e.preventDefault()

            this.add(45)

            axios.post("/api/login", this.state)
                .then(response => {
                    
                   if(response.data.errors==undefined){
                      
                       Cookies.set('token', response.data.token,{ expires: 7 })

                  
                       window.location.href = `/dashboard`;
                       this.setState({
                         loadingBarProgress: 100
                       })
                  
                   }
                   else{
                       this.setState({
                           errors:response.data.errors,
                           loadingBarProgress: 0
                    })

                   }

                })
                .catch(error => {
                    console.log(error)
                })

        
    
    }
    forgot_pass_control =() => {
        this.setState({
            forgot_pass: !this.state.forgot_pass
        })
        if (this.state.button_msg==='Forgot Password? '){
            this.setState({
                button_msg: '<- Go Back'
            })
        }else{
            this.setState({
                button_msg: 'Forgot Password? '
            })
        }
    }
    
    render(){
        
        if(Cookies.get('token'))
        {
            
            window.location.href = `/dashboard`;
           
        }
        if(!Cookies.get('token')){

                
                return(
                    
                <div className="login">
                    <div className={styles.bgBlack}>
                    <LoadingBar
                            progress={this.state.loadingBarProgress}
                            height={5}
                            color='yellow'
                            onLoaderFinished={() => this.onLoaderFinished()}
                            />
                        <div className="row">
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
                                { !this.state.forgot_pass &&
                                    <div>
                                        <h1 className="display-4 text-center font-weight-bold">Log In</h1>
                                        <p className="lead text-center">Sign in to your account</p>
                                        <form action="dashboard.html" onSubmit={this.submithandler} >
                                            <div className="form-group">
                                                <input type="email"  value={this.state.email} onChange={this.changehandler} className="form-control form-control-lg" placeholder="email"
                                                    name="email" required/>
                                                
                                            </div>
                                            <div className="form-group">
                                                <input type="password"  value={this.state.password} onChange={this.changehandler} className="form-control form-control-lg" placeholder="Password"
                                                    name="password" required/>
                                                    
                                        
                                            </div>
                                            {this.state.errors.Email ? 
                                                        <div className='alert alert-danger'>{this.state.errors.Email}</div>:null}
                                            {this.state.errors.Password ? 
                                                        <div className='alert alert-danger'>{this.state.errors.Password}</div>:null}            

                                        
                                            <a href="/signup" className={styles.link}>Don't have an Account?</a>
                                            <input type="submit" className="btn btn-primary btn-block mt-4 pt-4 pb-4"/>
        
                                        
                                        </form>
                                    </div>
                                }
                                <button className='btn btn-primary mt-2 mb-2'  onClick={this.forgot_pass_control} >{this.state.button_msg}</button>
                                
                                {this.state.forgot_pass &&
                                <div>
                                    <form >
                                        <label htmlFor="">Type your email.  We will send an email to reset your password</label>
                                        <input className={" form-control form-control-lg"}  type="email"  name="femail" onChange={this.changehandler} value={this.state.femail} placeholder="Email" required/>
                                        {this.state.ferror.email ? 
                                            <span className='error'>{this.state.ferror.email}</span>:null}
                                        <button type="button" onClick={this.send.bind(this)} className="btn btn-primary btn-block mt-4 pt-4 pb-4">Submit</button>
                                    </form>
                                </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
    }
}

export default Login