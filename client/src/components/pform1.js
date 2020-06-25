
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
        confirmPassButton: false
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
        console.log("IN THE FUCNTIONSSSSS")

        //send axios here and write following lines after getting password verified
        this.setState({
            change: false,
            confirmPassButton: true,
            
        })
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
                            **********
                            </div>
                            <button className="btn btn-warning float-right" onClick={this.changepassview.bind(this)}>Change</button>
                            </td>
                            { this.state.change && !this.state.confirmPassButton &&
                                <div className="block">
                                    <div>
                                        First enter your password for security reasons.
                                    </div>
                                    <div>
                                        <input  type="password"  ref="theTextInput"/>
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
                                            <input  type="password"  ref="theTextInput"/>
                                        </div>
                                        <div>
                                            Again, Type Your password to confirm
                                        </div>
                                        <div>
                                            <input  type="password"  ref="theTextInput"/>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary float-left mt-1" >confirm</button>
                                        </div>
                                        
                                        
                                    </div>
                                
                                }
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