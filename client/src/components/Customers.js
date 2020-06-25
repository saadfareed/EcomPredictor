import React, { Component } from 'react';
import styles from '../css/home.module.css';
import AddCustomer from './AddCustomer'
import axios from 'axios';  
import Cookies from 'js-cookie'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import Skeleton from 'react-loading-skeleton';

import LoadingBar from 'react-top-loading-bar';


import 'bootstrap/dist/css/bootstrap.min.css';
class Customer extends Component {
    constructor(props) {
        super(props);
        this.state={
            addCustBtn: 0,
            customers:[],
            executed:[],
            refresh:false,
            isLoading: true,
            isDeleted: false,
            errorMessage: null,
            loadingBarProgress: 0,
            modelIsOpen: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange (e){
        const checked =this.state.checked;
        checked[e.target.id] = e.target.checked;
        
        this.setState({
         checked:checked
         
        });
       
    }
    
    toggleModel=(e)=>{
        e.preventDefault();
        this.setState({
            modelIsOpen: !this.state.modelIsOpen 
        })
    }
    componentDidMount(){
         axios.get('/api/getCustomers',{headers: {token: Cookies.get('adtoken')}})
        .then(response => {

            this.setState({
                customers:response.data.customers,
                executed:response.data.executed,
                isLoading:false
            })
           
            
           
        })
        .catch(function (error) {
            if (error.response) {
             
              if(error.response.status==401){
                Cookies.remove('adtoken')
                  window.location.href=`/adminlogin`
              }
              
            }
          });
       
     }
     add = value => {
        this.setState({
          loadingBarProgress: this.state.loadingBarProgress + value
        });
      };
     delete(email){
		const body={
			email:email
			
        }
        this.add(30)
       
        
		axios.post("/api/getCustomers/delete",body,{headers: {token: Cookies.get('adtoken')}})
		.then(response => {
           
            this.setState({
                customers:response.data.customers,
                executed:response.data.executed,
                isDeleted:true,
                loadingBarProgress: 100,
                modelIsOpen: false
            })
            

		})
		.catch(error => {
            this.setState({
                errorMessage: error
            })
			console.log(error)
        })

	}
    onClickAddBtn = ()=>{
        if (this.state.addCustBtn == 0){
            this.setState({
                addCustBtn: 1
            })
        }
    } 
    

    
    onLoaderFinished = () => {
        this.setState({ loadingBarProgress: 0 });
      };

    render() {

        if(this.state.isLoading){
            return(
                <div>
                    <div  >
                        <span   >{<Skeleton width={500} height={40}/>} </span>
                        <span   style={{float:"right"}}>{<Skeleton width={130} height={40}/>} </span>
                        
                    </div>
                    <br/>
                    <span   >{<Skeleton width={25} height={30}/>} </span>
                    <span style={{margin: "0 1rem " }}>{<Skeleton width={100} height={30}/>} </span>
                    <span style={{margin: "0 .5rem " }}>{<Skeleton width={80} height={30}/>} </span>
                    <span style={{margin: "0 .5rem " }}>{<Skeleton width={250} height={30}/>} </span>
                    <span style={{margin: "0 .5rem " }}>{<Skeleton width={130} height={30}/>} </span>
                    <span style={{margin: "0 .5rem " }}>{<Skeleton width={80} height={30}/>} </span>
                    <span style={{margin: "0 .5rem " }}>{<Skeleton width={90} height={30}/>} </span>
                    <span style={{margin: "0 .5rem " }}>{<Skeleton width={170} height={30}/>} </span>
                    <br/>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                    <br/>
                    <span   >{<Skeleton width={20} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={90} height={20}/>} </span>
                    <span style={{margin: "0 .9rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.3rem " }}>{<Skeleton width={230} height={20}/>} </span>
                    <span style={{margin: "0 1.0rem " }}>{<Skeleton width={110} height={20}/>} </span>
                    <span style={{margin: "0 1.2rem " }}>{<Skeleton width={60} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={70} height={20}/>} </span>
                    <span style={{margin: "0 1.1rem " }}>{<Skeleton width={150} height={20}/>} </span>
                    <br/>
                </div>
            )
        }
        return (
            <div>
                <LoadingBar
                    progress={this.state.loadingBarProgress}
                    height={5}
                    color='yellow'
                    onLoaderFinished={() => this.onLoaderFinished()}
                    />
               <div className= "container">
                    <div className= {styles.heading1}>Customers</div>
                    <div className= {styles.paragraph1}>    -Currently registered in the system</div>

                    <button type="button" className="btn btn-primary float-right" onClick= {this.onClickAddBtn}>Add Customer</button>
                    
                    { this.state.addCustBtn !=0 &&
                        <AddCustomer/>
                    }
                    {this.state.isDeleted &&
                    <div class="alert alert-success mt-3" role="alert">
                        The selected customer has been successfully removed from our records.
                    </div>
                    }
                    {this.state.errorMessage &&
                    <div class="alert alert-danger mt-3" role="alert">
                        {this.state.errorMessage}
                    </div>
                    }
                    <div className="table-responsive table-bordered table-hover mt-4">
                        <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">First Name </th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Subscription Date</th>
                            <th scope="col">Plan</th>
                            <th scope="col">Data Uploaded</th>
                            <th scope="col">Actions Executed</th>
                            <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.customers.map((user,index)=>{
                               return(
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{user.Firstname}</td>
                                <td>{user.Lastname}</td>
                                <td>{user.Email}</td>
                                <td>{user.date}</td>
                                <td>{user.Plan}</td>
                                {user.DataUploaded?  <td>Yes</td>: <td>No</td>}
                               
                                <td>{this.state.executed[index]}</td>

                                <Modal isOpen={this.state.modelIsOpen}>
                                    <ModalHeader toggle = { (e)=>{ this.toggleModel(e) } }>Are You Sure?</ModalHeader>
                                    <ModalBody>This will delete record in the Database. Do you still want to proceed? </ModalBody>
                                    <ModalFooter>
                                    <button type="button" onClick={this.delete.bind(this,user.Email)} className="btn btn-primary ">Yes</button>
                                    
                                    <button class="btn btn-secondary " onClick={   (e)=>{ this.toggleModel(e) }  }>No</button>
                                    </ModalFooter>
                                </Modal>

                                <td><button type="button" onClick={   (e)=>{ this.toggleModel(e) }} className="btn btn-primary ">delete</button></td>
                                </tr>
                               )

                            })
                        }
                           
                            
                            
                        </tbody>
                        </table>
                    </div>
               </div>
               
               




            </div>
        );
    }
}



export default Customer;