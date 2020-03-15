import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {UserRole} from "./enums/role";

const PrivateRoute = ({ component: Component, currentUser, canAccess, ...rest }) => {
    if (currentUser && currentUser.role
        && ((currentUser.role === UserRole.administrator && canAccess.includes(UserRole.administrator))
        || (currentUser.role === UserRole.election_officer && canAccess.includes(UserRole.election_officer))
        || (currentUser.role === UserRole.voter && canAccess.includes(UserRole.voter))))
        return (<Route {...rest} render={props => <Component {...props} />} />);
    return <Redirect to="/auth/login?denied=1" />
};

export default PrivateRoute;
