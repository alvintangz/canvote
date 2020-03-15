import './ActivateAccount.scss';
import React from 'react';
import me from '../../../api/me';
import { Redirect } from "react-router-dom";

interface Props {
    location: Location
}

interface State {
    tkn: string,
    pwd: string,
    pwdConfirm: string,
    error: string,
    activated: boolean
}

export class ActivateAccount extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tkn: '',
            pwd: '',
            pwdConfirm: '',
            error: null,
            activated: false
        };
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        this.setState({ tkn: searchParams.get('tkn') });
    }

    handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        try {
            me.activateAccount(this.state.tkn, this.state.pwd, this.state.pwdConfirm)
                .then(() => {
                    this.setState({ activated: true });
                })
                .catch((err) => {
                    // TODO
                    console.log(err);
                })
        } catch (e) {
            this.setState({ error: e.message });
        }
    };

    handlePwdChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({pwd: event.currentTarget.value});
    };

    handlePwdConfirmChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({pwdConfirm: event.currentTarget.value});
    };

    render() {
        if (this.state.activated) return (<Redirect to="/auth/login?activated=1" />);
        return (
            <div>
                <h1>Activate Account</h1>
                {
                    !this.state.tkn ? (
                        <div className="alert alert-danger">
                            <p>Invalid token for account activation.</p>
                        </div>
                    ) : (
                        <form onSubmit={this.handleSubmit}>
                            {
                                this.state.error && (
                                    <div className="alert alert-danger">
                                        <p>{this.state.error}</p>
                                    </div>
                                )
                            }
                            <div className="form-group">
                                <label className="required">
                                    New Password
                                    <input type="password"
                                           className="form-control"
                                           placeholder="New Password"
                                           value={this.state.pwd}
                                           onChange={this.handlePwdChange}
                                           autoComplete="new-password"
                                           required />
                                </label>
                            </div>
                            <div className="form-group">
                                <label className="required">
                                    Confirm Password
                                    <input type="password"
                                           className="form-control"
                                           placeholder="Confirm Password"
                                           value={this.state.pwdConfirm}
                                           onChange={this.handlePwdConfirmChange}
                                           autoComplete="new-password"
                                           required />
                                </label>
                            </div>
                            <input type="submit" className="btn btn-primary" value="Submit" />
                        </form>
                    )
                }
            </div>
        );
    }
}

export default ActivateAccount;
