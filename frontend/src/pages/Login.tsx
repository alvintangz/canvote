import React from 'react';
import authApi from '../api/auth';
import meApi from '../api/me';
import {AxiosError, AxiosResponse} from 'axios';
import {AuthActionType} from '../enums/actions/auth.types'
import {connect} from "react-redux";
import {User} from "../interfaces/user";
import { Redirect } from "react-router";

interface Props {}
const mapDispatchToProps = dispatch => ({
    onLoggedIn: (user) =>
        dispatch({ type: AuthActionType.LOGIN_SUCCESS, user }),
});

interface Props {
    onLoggedIn: (user: User) => void;
    location: Location;
}

interface State {
    email: string;
    password: string;
    errorDetails: string[];
    success: boolean;
}

enum AlertState {
    ACTIVATED,
    ACCESS_DENIED
}

class Login extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorDetails: [],
            success: false
        };
    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({email: event.currentTarget.value});
    };

    handlePasswordChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({password: event.currentTarget.value});
    };

    handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        authApi.loginFirst(this.state.email, this.state.password).then(() => {
            meApi.retrieve().then((res: AxiosResponse<User>) => {
                this.props.onLoggedIn(res.data);
                this.setState({ success: true });
            });
        }).catch((error: AxiosError) => {
            if (error.code === "401")
                this.setState({ errorDetails: [error.response.data.detail] });
            else if (error.code === "422")
                this.setState({ errorDetails: error.response.data.detail.map((err) => err.msg) });
            else
                this.setState({ errorDetails: [error.response.data.detail.toString()] });
        });
    };

    get alertState(): AlertState | null {
        const searchParams = new URLSearchParams(this.props.location.search);
        if (searchParams.get('activated')) return AlertState.ACTIVATED;
        if (searchParams.get('denied')) return AlertState.ACCESS_DENIED;
        return null;
    }

    render() {
        if (this.state.success) return (<Redirect to="/" />);
        return (
            // TODO
            <div>
                <h1>Login</h1>
                {this.state.errorDetails && this.state.errorDetails.length > 0 ? (
                    <div className="alert alert-warning">
                        <p>Issue logging in</p>
                        <ul>
                            {this.state.errorDetails.map(error => <li>{error}</li>)}
                        </ul>
                    </div>
                ) : (
                    this.alertState === AlertState.ACTIVATED ? (
                        <div className="alert alert-success">
                            <h2>Account Activated</h2>
                            <p>You account has been activated. You can now log in.</p>
                        </div>
                    ) : (this.alertState === AlertState.ACCESS_DENIED && (
                        <div className="alert alert-danger">
                            <h2>Access Denied</h2>
                            <p>You were trying to access a page that you do not have access to.</p>
                        </div>
                    ))
                )}
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="required">
                            E-mail address:
                            <input type="email"
                                   className="form-control"
                                   placeholder="E-mail address"
                                   name="username"
                                   onChange={this.handleEmailChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="required">
                            Password:
                            <input type="password"
                                   className="form-control"
                                   placeholder="Password"
                                   onChange={this.handlePasswordChange}
                                   autoComplete="password"
                                   required />
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Login);
