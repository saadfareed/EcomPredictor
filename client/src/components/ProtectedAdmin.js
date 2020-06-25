import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from 'js-cookie'

function isLogin(){

    if(Cookies.get('adtoken'))    
    {
      return true;
    }
    else{
      return false;
    }

}
export const ProtectedRouteAdmin = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isLogin()) {
           
          return <Component {...props} />;
        } else {
          return <Redirect
          to={{
            pathname: "/adminlogin",
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