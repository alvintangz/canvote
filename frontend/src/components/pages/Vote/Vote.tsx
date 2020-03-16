import './Vote.scss';
import React, { Component } from 'react';
import { User } from "../../../interfaces/user";
import {connect} from "react-redux";


const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

interface Props {
    currentUser: User
}

interface State {}


export class Vote extends Component<Props, State> {
    render() {
        return (
            <div>
                Vote For:
            </div>
        );
    }
}

export default connect(mapStateToProps)(Vote);

