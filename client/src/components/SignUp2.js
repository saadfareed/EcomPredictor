import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';  

import Cookies from 'js-cookie'


class SignUp extends Component {

    constructor(props){
        super(props)
        this.state={
            fname: '',
            lname: '',
            email: '',
            password: '',
            errors:{}
            
        }
    }
    submitForm=()=>{
        
        axios.post("/api/signup/registor", this.state)
                .then(response => {
                    if(response.data.errors==undefined){
                        window.location.href = `/login`;
                    }
                    else{
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
    return(

        <div className="container">
            <form className="pt-5" >
                <div className="form-group pt-5">
                    <label >First Name</label>
                    <input name="fname" type="fname" className="form-control"  onChange={this.changehandler} value={this.state.fname}   placeholder="Enter first name"/>
                    {this.state.errors.Firstname ? 
                        <span className='error'>{this.state.errors.Firstname}</span>:null}
                    
                </div>
                <div className="form-group">
                    <label >Last Name</label>
                    <input name="lname" type="lname" className="form-control"  onChange={this.changehandler} value={this.state.lname} placeholder="Enter last name"/>
                    {this.state.errors.Lastname ? 
                        <span className='error'>{this.state.errors.Lastname}</span>:null}
                </div>


                <div className="form-group">
                    <label >Email address</label>
                    <input name="email" type="email" className="form-control" onChange={this.changehandler} value={this.state.email}  placeholder="Enter email"/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    {this.state.errors.email ? 
                        <span className='error'>{this.state.errors.email}</span>:null}
                </div>
                <div className="form-group">
                    <label >Password</label>
                    <input name="password" type="password" className="form-control"  onChange={this.changehandler} value={this.state.password} placeholder="Password"/>
                    {this.state.errors.Password? 
                        <span className='error'>{this.state.errors.Password}</span>:null}
                </div>
                <button type="button" onClick={this.submitForm.bind(this)}>submit</button>
                
               
            </form>
           
            
        </div>
        
    );
  };
}


export default SignUp;