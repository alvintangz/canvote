import * as React from "react";
import {NavLink, Link} from "react-router-dom";
import {connect} from "react-redux";
import {User} from "../../interfaces/models/user";
import authApi from '../../api/auth';
import Logo from './Logo.png';
import {AuthActionType} from "../../enums/actions/auth.types";
import LinksByUserRole from './NavLinks';
import {UserRole} from "../../enums/role";
import { withRouter } from 'react-router-dom';


const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

const mapDispatchToProps = dispatch => ({
    onLoggedOut: () =>
        dispatch({ type: AuthActionType.LOGOUT_SUCCESS }),
});

interface Props {
    currentUser: User;
    onLoggedOut: () => void;
    history: any;
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
            this.props.onLoggedOut();
            this.props.history.push('/auth/login');
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
                                <img src={Logo} alt="CanVote" className="cv-brand-logo" />
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
                <nav id="mainNav">
                    <div className="container">
                        <ul>
                            <li><NavLink to="/" exact={true} activeClassName="active">Home</NavLink></li>
                            {
                                this.props.currentUser ?
                                    LinksByUserRole[
                                        LinksByUserRole.findIndex(item => item.role === this.props.currentUser.role)
                                        ].links.map(link => (
                                        <li key={link.title}><NavLink to={link.linkTo} activeClassName="active">{link.title}</NavLink></li>
                                    )) : LinksByUserRole[LinksByUserRole.findIndex(item => UserRole.anonymous === item.role)].links.map(link => (
                                        <li key={link.title}><NavLink to={link.linkTo} activeClassName="active">{link.title}</NavLink></li>
                                    ))
                            }
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
