
//All imports
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import Cookies from 'js-cookie' 
import LoadingBar from 'react-top-loading-bar';
import buffering from '../images/buffering.gif' 
import styles from '../css/SignUp.module.css'




// Component Starts
class AddCustomer extends Component {

    //Constructor
    constructor(props) {
        super(props);

        // component states
        this.state={
            fname:'',
            lname:'',
            email:'',
            password:'123456',
            plan:"Free",
            errors:{},
            loadingBarProgress: 0,
            buffering: false
        }

        
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }


    // loading bar methods
    add = (value) =>  {
        this.setState({
        loadingBarProgress: this.state.loadingBarProgress + value
        });
    }
    onLoaderFinished = () => {
        this.setState({ loadingBarProgress: 0 });
    };



  

    changehandler=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }


    // Form submission
    submitForm=(e)=>{

        this.setState({
            buffering:true
        })

        this.add(60)
        e.preventDefault()
        
        axios.post("/api/signup/byadmin", this.state,{headers: {token: Cookies.get('adtoken')}})
                .then(response => {
                    if(response.data.errors==undefined){
                        // succesfull response
                        window.location.href = `/admindashboard/customers`;
                        this.setState({
                            loadingBarProgress: 100,
                            buffering:false
                        })
                        
                    }
                    else{
                       // errors in response
                        this.setState({errors:response.data.errors})
                        this.setState({
                            loadingBarProgress: 0,
                            buffering:false
                        })
                    }
                  
                });

     }
     handleDropdownChange(e) {
        this.setState({ plan: e.target.value });
      }
    

    

    render() {


        return (


            <div>
                <div className= "container mt-4">

                        {/* Yellow Loading Bar */}
                        <LoadingBar
                            progress={this.state.loadingBarProgress}
                            height={5}
                            color='yellow'
                            onLoaderFinished={() => this.onLoaderFinished()}
                        /> 

                        <form   onSubmit={this.submitForm}>
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                <label for="fname">First Name</label>
                                <input type="fname" class="form-control" value={this.state.fname} onChange={this.changehandler} id="fname" placeholder="first name" required/>
                                {this.state.errors.Firstname ? 
                                    <span className='error'>{this.state.errors.Firstname}</span>:null}
                                </div>
                                <div class="form-group col-md-4">
                                <label for="lname">Last Name</label>
                                <input type="lname" class="form-control" value={this.state.lname} onChange={this.changehandler} id="lname" placeholder="last name" required/>
                                {this.state.errors.Lastname ? 
                                    <span className='error'>{this.state.errors.Lastname}</span>:null}
                                </div>
                                <div class="form-group col-md-4">
                                <label for="inputEmail4">Email</label>
                                <input type="email" class="form-control" value={this.state.email} onChange={this.changehandler} id="email" placeholder="Email" required/>
                                {this.state.errors.email ? 
                                    <span className='error'>{this.state.errors.email}</span>:null}
                                </div>
                                
                                
                            </div>
                            <div class="form-row">
                                
                                <div class="form-group col-md-3">
                                <label for="inputState">Plan</label>
                                <select id="plan" class="form-control" onChange={this.handleDropdownChange}>
                                    
                                    <option value="Free">Free</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Premium">Premium</option>
                                </select>
                                
                                </div>
                        
                                
                                

                            </div>
                            <input type="submit" style={{display: "inline"}} className="btn btn-primary"/>
                            {this.state.buffering && 
                                        <img className={styles.buffer + " ml-2"} src={buffering} alt=""/>}
                        
                        </form>

                </div>
            </div>
        );
    }
}



export default AddCustomer;