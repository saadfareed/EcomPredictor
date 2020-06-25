import React, { Component } from 'react';
import PformElement from './pformElement.js'
import axios from 'axios';  
import Cookies from 'js-cookie'
import styles from '../css/sf.module.css';

class pform extends Component{

    state = {
        value: "text",
        isInEditMode: false,
        profile:{},
        Firstname:"",
        Lastname:"",
        change: false,
        confirmPassButton: false,
        password:'',
        newpassword:'',
        conpassword:'',
        errors:{},
        
    }
    changehandler=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
   
    componentDidMount(){
        axios.get('/api/getCustomers/profileinfo',{headers: {token: Cookies.get('token')}})
        .then(response => {
           
           if(response.data.profile){
              this.setState({profile:response.data.profile,Firstname:response.data.profile.Firstname,Lastname:response.data.profile.Lastname})
           }
           
            
        });
       
    }

    changepassview = () => { 

        
        this.setState({
            change: !this.state.change
        })
    
    }
    confirmpass = () => {
       if(this.state.password==""){
           const errors={
               password:"password is required"
           }
           this.setState({errors:errors})
       }
       else{
        axios.post('/api/getCustomers/checkpassword',this.state,{headers: {token: Cookies.get('token')}})
        .then(response => {
           
           if(response.data.check==true){
            this.setState({
                change: false,
                confirmPassButton: true,
                
            })
           
           }
           else if(response.data.check==false){
            const errors={
                password:"password is incorrect"
            }
            this.setState({errors:errors})

           }
           
            
        });

        

       }

        
       
    }

    changepass = () => {
        if(this.state.newpassword=="" || this.state.conpassword=="" ){
            const errors={
                newpassword:"password is required"
            }
            this.setState({errors:errors})
        }
        else if(this.state.newpassword!=this.state.conpassword){
            const errors={
                newpassword:"password do not match"
            }
            this.setState({errors:errors})

        }
        else{
         axios.post('/api/getCustomers/changepassword',this.state,{headers: {token: Cookies.get('token')}})
         .then(response => {
           // this.changepassview()
           
           const errors={
               newpassword:"Password Changed Successfully."
           }
           this.setState({
               errors:errors,
               confirmPassButton:false
            })
           
            
             
         });
 
         
 
        }
 
         
        
     }
   
    render(){
    
         
        return (
            <div>
                <br/>
                <br/>
                <br/>
                <br/>
                <table class="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Label</th>
                        <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.Firstname!=""?
                        <tr>
                        <th scope="row">First Name</th>
                        <td><PformElement value={this.state.Firstname} id="1"/><span className="badge badge-warning inline ml-2"> Editable</span></td>
                        
                        </tr>
                    :null}
                    {this.state.Lastname!=""?
                        <tr>
                    
                        <th scope="row">Last Name</th>
                        
                       
                        <td><PformElement  value={this.state.Lastname} id="2"/><span className="badge badge-warning inline ml-2"> Editable</span></td>
                        </tr>
                    :null}

                    
                    <tr>
                    <div>
                        <th scope="row">Password</th>
                        
                            
                        </div>
                        <td>
                        <div className="block">
                            <td className="block">
                            <div>
                            ****
                            </div>
                            <button className="btn btn-warning float-right" onClick={this.changepassview.bind(this)}>Change</button>
                            </td>
                            { this.state.change && !this.state.confirmPassButton &&
                                <div className="block">
                                    <div>
                                        First enter your password for security reasons.
                                    </div>
                                    <div>
                                        
                                        <input type="password"  value={this.state.password} onChange={this.changehandler} className="form-control form-control-lg" placeholder="Password"
                                            name="password" required/>
                                            {this.state.errors.password ? 
                                                <div className='alert alert-primary mt-2'>{this.state.errors.password}</div>:null}
                                    </div>
                                    <div>
                                        <button className="btn btn-primary float-left mt-1" onClick={this.confirmpass.bind(this)}>confirm</button>
                                    </div>
                                    
                                    
                                </div>
                                }
                            
                                { this.state.confirmPassButton &&
                                    <div className="block">
                                        <div>
                                            Type Your password
                                        </div>
                                        <div>
                                          
                                            <input type="password"  value={this.state.newpassword} onChange={this.changehandler} className="form-control form-control-lg" placeholder="Password"
                                            name="newpassword" required/>
                                        
                                        </div>
                                        <div>
                                            Again, Type Your password to confirm
                                        </div>
                                        <div>
                                        <input type="password"  value={this.state.conpassword} onChange={this.changehandler} className="form-control form-control-lg" placeholder="Confirm Password"
                                        name="conpassword" required/>
                                        {this.state.errors.newpassword && this.state.errors.newpassword !== "Password Changed Successfully."? 
                                            <div className='alert alert-danger mt-2'>{this.state.errors.newpassword}</div>:null}
                                        </div>
                                        <div>
                                            <button onClick={this.changepass.bind(this)} className="btn btn-primary float-left mt-1" >confirm</button>
                                        </div>
                                        
                                        
                                    </div>
                                
                                }
                                {this.state.errors.newpassword === "Password Changed Successfully." ? 
                                            <div className='alert alert-success mt-2'>{this.state.errors.newpassword}</div>:null}
                        </div>
                        </td>
                        
                    </tr>
                    



                    {this.state.profile.Email!=""?
                        <tr>
                        <th scope="row">Email</th>
                        <td>{this.state.profile.Email}</td>
                        </tr>
                    :null}
                    {this.state.profile.Plan!=""?

                        <tr>
                        <th scope="row">Plan</th>
                        <td>{this.state.profile.Plan}</td>
                        </tr>
                    :null}
                    </tbody>
                    </table>

            </div>

        );

        
    };


}
export default pform;