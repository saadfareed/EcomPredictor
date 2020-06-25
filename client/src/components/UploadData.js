import React, { Component } from 'react';
import styles from '../css/uploaddata.module.css';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'
import buffering from '../images/buffering.gif' ;

import Skeleton from 'react-loading-skeleton';



class UploadData extends Component {

    constructor(props){
        super(props)

        this.state = {
            selectedFile: null,
            loaded:0,
            uploaded: 0,
            isLoading: true,
            buffering: false
        }

        
    }

   
    onClickHandler = () => {
        
        this.setState({
            buffering:true
        })
        const form = new FormData();
        
        
        form.append("file", this.state.selectedFile);
           
        axios.post('/api/upload',form, {headers: {token: Cookies.get('token')}}, {
                onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                })
            }, 
        })
        .then(response=>{
            console.log(response)
        }).then(res => { 
            toast.success('upload success')
            this.setState({
                buffering:false
            })
            
        })
        .catch(err => { 
            toast.error('upload fail')
            this.setState({
                buffering:false
            })
        })
         
       
     
    }

    onChangeHandler = event=>{

        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
          })
    
    }

    componentDidMount(){
        axios.get('/api/upload/view',{headers: {token: Cookies.get('token')}})
        .then(response=>{
            console.log(response)
            this.setState({
                uploaded: response.data.uploaded,
                 isLoading: false
                
            });
            
        });
    }

  render() {



    if(this.state.isLoading){
        return(
            <div className="row">

                <div className="col-6">
                    <br/>
                    
                    <span style={{margin: "1rem 0"}}><Skeleton width={450} height={30}/></span>
                    <br/>
                    <br/>
                    <br/>
                    <span style={{display: "block",margin: "1.5rem 0"}}><Skeleton width={450} height={30}/></span>
                    
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    <span style={{display: "block", margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    <span style={{display: "block", margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    
                    <span style={{display: "block",margin: "1.5rem 0"}}><Skeleton width={450} height={30}/></span>
                    
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    <span style={{display: "block", margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    <span style={{display: "block", margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    
                    <span style={{display: "block",margin: "1.5rem 0"}}><Skeleton width={450} height={30}/></span>
                    
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    <span style={{display: "block", margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>
                    <span style={{display: "block", margin: ".5rem 0"}}><Skeleton width={500} height={20}/></span>

                </div>
                <div className="col-6">
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={400} height={50}/></span>
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={400} height={20}/></span>
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={110} height={50}/></span>
                    <span style={{display: "block",margin: ".5rem 0"}}><Skeleton width={400} height={40}/></span>

                </div>
                
                
            </div>
        )
    }
    return(
        <div>

            
            <div className={'row'}>
                <div className={'col-6'}>
                    <div className={styles.first_heading}>Upload your data in .csv format</div>
                    <div className={styles.heading}>What should be include in data?</div>
                    <div className={styles.paragraph}>
                        
                            We need certain columns from you in order to apply 
                            our algorithms. We require a data file containing atleast
                            these following columns. 
                        
                    </div>
                    <div className={styles.heading}>Why do I need to Upload my Data? </div>
                    <div className={styles.paragraph}>
                    
                        In order to examine and make predictions about your 
                        store, we need data containing certain columns mentioned 
                        above. With our Automated Analyzing System, we show you 
                        results based on the data you provide here.   
                    
                    </div>
                    <div className={styles.heading}>Data Privacy</div>
                    
                    <div className={styles.paragraph}>
                        Our Security Policy strictly adhere us NOT to share your data 
                        with anyone.   
                    </div>
                    

                </div>
                <div className={'col-6'}>
                    <div className="form-group">
                        <ToastContainer />
                    </div>
                    <div className="custom-file">
                        <input type="file" name="file" className="custom-file-input" onChange={this.onChangeHandler} />
                        <label className="custom-file-label" >Choose file...</label>
                        <div className="form-group mt-2">
                            <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
                        </div>

                        <button type="button" className={'btn btn-primary btn-lg'} onClick={this.onClickHandler}>Upload Data </button>
                        {this.state.buffering?  
                            <img className={styles.loader} src={buffering} alt=""/>:null
                        }
                    
                    </div>
                    { this.state.uploaded == true &&
                    <div className="alert alert-success mt-4" role="alert">
                        We have stored your data
                    </div>}

                   </div>  
            </div>


        </div>
    );
  };
}
export default UploadData;