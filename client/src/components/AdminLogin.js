import React,{Component} from 'react'
import axios from "axios";
import Cookies from 'js-cookie'
import styles from '../css/SignUp.module.css';
import LoadingBar from 'react-top-loading-bar';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import buffering from '../images/buffering.gif' 

class AdminLogin extends Component{

    constructor(props){
        super(props)
        this.state={
            email:'',
            password:'',
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


    changehandler=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    
    submithandler=(e)=>{
        this.setState({
            buffering:true
        })

        this.add(60)
        e.preventDefault()
        

            axios.post("/api/adminLogin", this.state)
                .then(response => {
                    
                   if(response.data.errors==undefined){
                        this.setState({
                            loadingBarProgress: 100,
                            buffering:false
                        })
                       Cookies.set('adtoken', response.data.token,{ expires: 7 })

                  
                       window.location.href = `/admindashboard`;

                   }
                   else{
                        this.setState({
                            loadingBarProgress: 0,
                            buffering:false
                            
                        })
                       this.setState({errors:response.data.errors})

                   }

                })
                .catch(error => {
                    console.log(error)
                })

        
    
    }

    render(){
        if(Cookies.get('adtoken'))
        {
            
            window.location.href = `/admindashboard`;
            
          
        }
        
        
        if(!Cookies.get('adtoken'))
        {
            return(
            <div className="login">
                <div className="container">
                <LoadingBar
                        progress={this.state.loadingBarProgress}
                        height={5}
                        color='yellow'
                        onLoaderFinished={() => this.onLoaderFinished()}
                        />
                <div className={styles.bgBlack}>
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
                                    <h1 className={styles.heading + " text-center mb-4"}>Admin Login</h1>
                                            
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
                                            <div className='alert alert-danger mt-1'>{this.state.errors.Email}</div>:null}
                                    {this.state.errors.Password? 
                                            <div className='alert alert-danger mt-1'>{this.state.errors.Password}</div>:null}

                                <input type="submit" className="btn btn-primary  mt-1"/>
                                {this.state.buffering && 
                                        <img className={styles.buffer + " ml-2"} src={buffering} alt=""/>}
                            </form>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            )
        }
    }
}

export default AdminLogin