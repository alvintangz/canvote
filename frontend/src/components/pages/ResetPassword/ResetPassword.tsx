import React, { Component } from 'react';
import './ResetPassword.scss';
import me from '../../../api/me';


interface Props {}

interface State {
    pwd: string,
    pwdConfirm: string
}


export class ResetPassword extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = { pwd: "", pwdConfirm: ""};
        this.handlePwdChange = this.handlePwdChange.bind(this);
        this.handlePwdConfirmChange = this.handlePwdConfirmChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        console.log("submitted req");

        me.resetPassword(this.state.pwd, this.state.pwdConfirm)
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
        // const jsonObj = {
        //     token: this.state.tkn,
        //     passwordOne: this.state.pwd,
        //     passwordTwo: this.state.pwdConfirm
        // }
        // me.activateAccount(this.state.tkn, this.state.pwd, this.state.pwdConfirm)
        //     .then((e) => { console.log(e)})
        //     .catch((err) => console.log(err))
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
                <h1>Reset Password</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            New Password:
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



export default ResetPassword;
