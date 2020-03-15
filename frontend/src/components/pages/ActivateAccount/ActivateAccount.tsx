import './ActivateAccount.scss';

import React, { Component } from 'react';
import me from '../../../api/me';

// import {  retrieve, resetPassword, activateAccount } from '../../../api/me'


interface Props {}

interface State {
    tkn: string,
    pwd: string,
    pwdConfirm: string
}


export class ActivateAccount extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {tkn: "", pwd: "", pwdConfirm: ""};
        this.handlePwdChange = this.handlePwdChange.bind(this);
        this.handlePwdConfirmChange = this.handlePwdConfirmChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search.replace('?', ''));        
        this.setState({
            tkn: searchParams.get('tkn')
        })

    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        console.log("submitted req");
        // const jsonObj = {
        //     token: this.state.tkn,
        //     passwordOne: this.state.pwd,
        //     passwordTwo: this.state.pwdConfirm
        // }
        me.activateAccount(this.state.tkn, this.state.pwd, this.state.pwdConfirm)
            .then((e) => { console.log(e)})
            .catch((err) => console.log(err))
    }

    handlePwdChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({pwd: event.currentTarget.value});
    } 

    handlePwdConfirmChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({pwdConfirm: event.currentTarget.value});
    } 
    render() {
        return (
            <div>
                <h1>Activate Account</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            Set Password:
                            <input type="password" className="form-control"
                            placeholder="New Password" value={this.state.pwd} onChange={this.handlePwdChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Confirm Password:
                            <input type="password" className="form-control"
                            placeholder="Confirm Password" value={this.state.pwdConfirm} onChange={this.handlePwdConfirmChange} required/>
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default ActivateAccount;
