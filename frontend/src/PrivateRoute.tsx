import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {UserRole} from "./enums/role";
import {connect} from "react-redux";
import {AuthActionType} from "./enums/actions/auth.types";
import authApi from "./api/auth";

const mapStateToProps = state => ({
    currentUser: state.authReducer.user,
});

const mapDispatchToProps = dispatch => ({
    handleLogout: () => dispatch({ type: AuthActionType.LOGOUT_FOR_USER, user: null })
});

const PrivateRoute = ({ component: Component, canAccess, handleLogout, ...rest }) => {
    if (canAccess && canAccess.length > 0) {
        if ((rest.currentUser && rest.currentUser.role
            && ((rest.currentUser.role === UserRole.administrator && canAccess.includes(UserRole.administrator))
            || (rest.currentUser.role === UserRole.election_officer && canAccess.includes(UserRole.election_officer))
            || (rest.currentUser.role === UserRole.voter && canAccess.includes(UserRole.voter)))) ||
            (!rest.currentUser && canAccess.includes(UserRole.anonymous)))
            return (<Route {...rest} render={props => <Component {...props} />} />);
    }

    // Log user out (first by resetting the state in redux)
    handleLogout();
    // Second, log out user in auth service
    authApi.logout();
    // Redirect user to login page
    return <Redirect to="/auth/login?denied=1" />;
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
