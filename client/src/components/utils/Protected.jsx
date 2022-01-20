import React from "react";
import { Route} from "react-router-dom";
import { Redirect,useLocation } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };
    let location = useLocation();
    const decodedJwt = parseJwt(localStorage.getItem("userToken")); 
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem("userToken") || decodedJwt.exp * 1000 < Date.now()){
        return <Redirect to={{pathname: '/',state: { from: location.pathname }}}  />
      }
        else return <Component {...props} />;
          
      }}
    />
  );
};

export default ProtectedRoute;