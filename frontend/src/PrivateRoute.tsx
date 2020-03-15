import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {UserRole} from "./enums/role";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

const PrivateRoute = ({ component: Component, canAccess, ...rest }) => {
    if (canAccess && canAccess.length > 0) {
        if ((rest.currentUser && rest.currentUser.role
            && ((rest.currentUser.role === UserRole.administrator && canAccess.includes(UserRole.administrator))
            || (rest.currentUser.role === UserRole.election_officer && canAccess.includes(UserRole.election_officer))
            || (rest.currentUser.role === UserRole.voter && canAccess.includes(UserRole.voter)))) ||
            (!rest.currentUser && canAccess.includes(UserRole.anonymous)))
            return (<Route {...rest} render={props => <Component {...props} />} />);
    }
    // TODO: Log user out 
    return <Redirect to="/auth/login?denied=1" />
};

export default connect(mapStateToProps)(PrivateRoute);
