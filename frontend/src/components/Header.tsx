import * as React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {User} from "../interfaces/user";
import authApi from '../api/auth';
import Logo from './Logo.png';
import './Header.scss';
import {AuthActionType} from "../enums/actions/auth.types";

const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};;

const mapDispatchToProps = dispatch => ({
    onLoggedOut: () =>
        dispatch({ type: AuthActionType.LOGOUT_SUCCESS }),
});

interface Props {
    currentUser: User;
    onLoggedOut: () => void;
}

class Header extends React.Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    logout = (): void => {
        authApi.logout().finally(() => {
            this.props.onLoggedOut();
        });
    };

    render() {
        return (
            <header>
                <div className="container">
                    {this.props.currentUser && (
                        <div className="row text-right cv-current-user">
                            <div className="col-sm-12 ">
                                <small>{this.props.currentUser.firstName} {this.props.currentUser.lastName} <strong className="cv-role">({this.props.currentUser.role})</strong> | <Link to="/reset-password">Reset Password</Link></small>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="brand col-xs-5 col-md-4">
                            <Link to="/">
                                <img src={Logo} alt="CanVote" className="Logo" />
                            </Link>
                        </div>
                        <div className="col-lg-8 text-right">
                            {
                                !this.props.currentUser ?
                                    (<Link to="/auth/login" className="btn btn-primary">Log in</Link>) :
                                    (<button type="button" className="btn btn-primary"
                                             onClick={this.logout}>Log out</button>)
                            }
                        </div>
                    </div>
                </div>
                <nav className="cv-nav">
                    <div className="container">
                    <div className="btn-toolbar list-inline" role="toolbar">
                        <div className="btn-group mr-2">
                                <Link to="/">
                                    <button type="button" className="btn btn-default">
                                        Home
                                    </button>
                                </Link>
                                <Link to="/manage/users">
                                    <button type="button" className="btn btn-default">
                                        Manage Users
                                    </button>
                                </Link>
                                <Link to="/manage/users/new">
                                    <button type="button" className="btn btn-default">
                                        Create User
                                    </button>
                                </Link>
                                <Link to="/">
                                    <button type="button" className="btn btn-default">
                                        Vote
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
