import React, { Component } from 'react';
import styles from '../css/home.module.css';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import Cookies from 'js-cookie' 
import Skeleton, { SkeletonTheme }  from 'react-loading-skeleton';






class Actions  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addCustBtn: 0,
            modelIsOpen: false,
            checked:[],
            isLoading: true,
        }
        this.handleChange = this.handleChange.bind(this);
    }



    // for handling Modal change
    handleChange (e){
        const checked =this.state.checked;
        checked[e.target.id] = e.target.checked;
        
        this.setState({
        checked:checked
        
        });
   
    }



    componentDidMount(){
        axios.get('/api/stats/status',{headers: {token: Cookies.get('adtoken')}})
        .then(response=>{
            this.setState({
                checked:response.data.checked,
                isLoading: false,
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



    // toggling modal
    toggleModel=(e)=>{
        e.preventDefault();
        this.setState({
            modelIsOpen: !this.state.modelIsOpen 
        })
   }
   

   // saving selected options
   save(){
      axios.post('/api/stats/updatestatus',this.state,{headers: {token: Cookies.get('adtoken')}})
      .then(response=>{
        window.location.href=`./actions`
       });
       
   }
    render(){


        // Show Skeleton when its not loaded yet

        if(this.state.isLoading){
            return (
                <div style={{ fontSize: 20, lineHeight: 2 }}>
                <h1>{this.props.title || <Skeleton />}</h1>
                    
                    <span   >{<Skeleton width={50} height={30}/>} </span>
                    <span style={{margin: "0 5rem " }}>
                        {<Skeleton width={400} height={30}/>} 
                    </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={100} height={30}/>} </span>
                    <span style={{margin: "0 2rem " }}>{<Skeleton width={100} height={30}/>} </span>
                    <br/>
                    <br/>

                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    <span   >{<Skeleton width={50}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={400}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={70}/>} </span>
                    <span style={{margin: "0 5rem " }}>{<Skeleton width={30}/>} </span>
                    
                    
                    
                    <div style={{float: "right"}}>{<Skeleton height={50} width={100}/>}</div>
                
                </div>
            );
        }
            
    

        // show that then axios has returned response 
        // all data is loaded
        return (
            <div>
                <div className= "container">
                    <div className= {styles.heading1}>Actions</div>
                    <div className= {styles.paragraph1}>    -Currently Present All Actions in the system</div>
                    
                    <form>
                        <div className=" table-responsive table-bordered table-hover mt-4">
                            <table className="table">
                        
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">All Actions </th>
                                <th scope="col">Status</th>
                                <th scope="col">Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>Sales Forecasting</td>
                                {this.state.checked[0]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="0" name="checked"  checked={this.state.checked[0]} onChange={e=>this.handleChange(e)}/>
                                
                                    </td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>Market Basket Analysis</td>
                                {this.state.checked[1]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="1" name="checked"  checked={this.state.checked[1] } onChange={e=>this.handleChange(e)}/></td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>RFM Modeling</td>
                                {this.state.checked[2]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="2" name="checked"  checked={this.state.checked[2]} onChange={e=>this.handleChange(e)}/></td>
                                </tr>
                                <tr>
                                <th scope="row">4</th>
                                <td>Churn Analysis</td>
                                {this.state.checked[3]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="3" name="checked"  checked={this.state.checked[3]} onChange={e=>this.handleChange(e)}/></td>
                                </tr>
                                <tr>
                                <th scope="row">5</th>
                                <td>Customer LifeTime Modeling</td>
                                {this.state.checked[4]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="4" name="checked"  checked={this.state.checked[4]} onChange={e=>this.handleChange(e)}/></td>
                                </tr>
                                <tr>
                                <th scope="row">6</th>
                                <td>Market Response Modeling</td>
                                {this.state.checked[5]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="5" name="checked"  checked={this.state.checked[5]} onChange={e=>this.handleChange(e)}/></td>
                                </tr>
                                <tr>
                                <th scope="row">7</th>
                                <td>Uplift Modeling</td>
                                {this.state.checked[6]?<td><span class="badge badge-success">Active</span></td>:<td><span class="badge badge-danger">Disabled</span></td>}
                                
                                <td><input type="checkbox" id="6" name="checked"  checked={this.state.checked[6]} onChange={e=>this.handleChange(e)}/></td>
                                </tr>


                                
                            </tbody>
                            </table>
                            
                        </div>
                        <button className="btn btn-primary float-right mt-3" onClick={   (e)=>{ this.toggleModel(e) }   }>Update</button>
                        

                        {/* Modal Implemeted */}
                        <Modal isOpen={this.state.modelIsOpen}>
                            <ModalHeader toggle = { (e)=>{ this.toggleModel(e) } }>Are You Sure?</ModalHeader>
                            <ModalBody>This will update changes in the Database. Do you still wanna proceed? </ModalBody>
                            <ModalFooter>
                            <button type='submit' onClick={this.save.bind(this)} class="btn btn-primary ">Yes</button>
                            <button class="btn btn-secondary " onClick={   (e)=>{ this.toggleModel(e) }  }>No</button>
                            </ModalFooter>
                        </Modal>

                    </form> 

                
                </div>
                

                


            </div>
        );
        
    }
}


export default Actions;