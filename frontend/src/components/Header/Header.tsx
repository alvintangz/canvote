import * as React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {User} from "../../interfaces/user";
import authApi from '../../api/auth';
import Logo from './Logo.png';
import './Header.scss';
import {AuthActionType} from "../../enums/actions/auth.types";

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

interface State {
    loggedOut: boolean;
}

class Header extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            loggedOut: false
        };
    }

    logout = (): void => {
        authApi.logout().finally(() => {
            // this.setState
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
                <div id="breadcrumbs">
                    <div className="container">
                        {/* TODO */}
                        <ol className="breadcrumb">
                            <li><Link to="/">Home</Link></li>
                        </ol>
                    </div>
                </div>
            </header>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
