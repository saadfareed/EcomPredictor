import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from 'js-cookie'

function isLogin(){
     
    if(Cookies.get('token'))    
    {
       return true
     
          
          
    }
    else{
      return false;
    }

}
export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        const check=isLogin()
        if (isLogin()) {
           
          return <Component {...props} />;
        } else {
          return <Redirect
          to={{
            pathname: "/login",
            state: {
              from: props.location
            }
          }}
        />
        }
      }}
    />
  );
};