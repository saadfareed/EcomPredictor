
import React, { Component } from 'react';
import axios from 'axios';  
import Cookies from 'js-cookie'


class pformElement extends Component{

    state = {
        label: this.props.label,
        value: this.props.value,
        id:this.props.id,
        isInEditMode: false,
        check:true
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
            
            });
          
        
    }
    
    updateComponentValue = () => {
        if(this.refs.theTextInput.value!=""){
            var letters = /^[A-Za-z]+$/;
            if(this.refs.theTextInput.value.match(letters))
              {
                this.updatedb(this.state.id,this.refs.theTextInput.value)
                this.setState({
                    isInEditMode: false,
                    value: this.refs.theTextInput.value,
                    check:true
                })
               
              }
              else{
                  this.setState({check:false})
              }
            

        }
        else{
            this.setState({
                check:false,
                
            })


        }
        
    }
    changehandler=(e)=>{
       
        let value = e.target.value

        value = value.replace(/[^A-Za-z]/ig, '')
      
        this.setState({
          value,
        })
    }
   

    renderEditView = () => {
        return <div style={{display: "inline"}}>
            <input type="text" defaultValue={this.state.value} ref="theTextInput"/>
            <button className="btn btn-danger ml-1" onClick={this.changeEditMode}>X</button>    
            <button className="btn btn-success ml-1" onClick={this.updateComponentValue}>OK</button> 
            {this.state.check?null:<span class=" ml-2 badge badge-warning">Enter correct name</span>}
           
            
        </div>
        
    }

    renderDefaultView = () => {
        return <div style={{display: "inline"}} onDoubleClick={this.changeEditMode}>{this.state.value}</div>
    }
    render(){
        
        return this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView()
        
    };


}
export default pformElement;