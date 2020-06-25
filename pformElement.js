
import React, { Component } from 'react';
import axios from 'axios';  
import Cookies from 'js-cookie'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/sf.module.css';

class pformElement extends Component{


    
    state = {
        label: this.props.label,
        value: this.props.value,
        id:this.props.id,
        isInEditMode: false
    }
    changeEditMode = () => {
        this.setState({
            isInEditMode: !this.state.isInEditMode
        })
       
    }
    updatedb(id,val){
        const body={
            id:id,
            val:val
        }
       
           
            axios.post('/api/getCustomers/updateinfo',body,{headers: {token: Cookies.get('token')}})
            .then(response => {
           
               console.log(response)
                return (<div className="alert alert-success"></div>);
            
            });
          
        
    }
    updateComponentValue = () => {
        if(this.refs.theTextInput.value!=""){
            this.updatedb(this.state.id,this.refs.theTextInput.value)
            this.setState({
                isInEditMode: false,
                value: this.refs.theTextInput.value
            })

        }
        else{
            this.setState({
                isInEditMode: false,
                value: this.state.value
            })


        }
        
    }

    renderEditView = () => {
        return <div className={styles.inlineClass}>
            <input  type="text" defaultValue={this.state.value} ref="theTextInput"/>
            <button className="btn btn-danger ml-1 " onClick={this.changeEditMode}>X</button>    
            <button className="btn btn-success ml-1 " onClick={this.updateComponentValue}>OK</button>   
        </div>
        
    }

    renderDefaultView = () => {
        return <div className={styles.inlineClass} onDoubleClick={this.changeEditMode}>{this.state.value}</div>
    }
    render(){
        
        return this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView()
        
    };


}
export default pformElement;