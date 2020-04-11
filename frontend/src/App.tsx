import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import meApi from './api/me';
import {AxiosResponse} from "axios";
import {User} from "./interfaces/models/user";
import {AuthActionType} from "./enums/actions/auth.types";
import {connect} from "react-redux";
import PrivateRoute from "./PrivateRoute";
import {UserRole} from "./enums/role";
import Header from "./components/Header";
import UnauthenticatedErrorInterceptor from './interceptors/unauthenticated';
import { Home, ActivateAccount, Credits, Election, LiveResults, Login, NotFound, ResetPassword, UserCreate, UserUpdate, UserList, Vote } from './pages';

const mapStateToProps = state => {
  return ({currentUser: state.authReducer.user});
};

const mapDispatchToProps = dispatch => ({
  onLoggedIn: (user) =>
      dispatch({ type: AuthActionType.USER_AUTHENTICATED_FROM_CHECK, user }),
});

interface Props {
  onLoggedIn: (user: User) => void;
  currentUser: User;
}

interface State {
  loaded: boolean;
}

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    // When component mounts, change state to current user (if exists)
    meApi.retrieve().then((response: AxiosResponse<User>) => {
      this.props.onLoggedIn(response.data);
      UnauthenticatedErrorInterceptor();
    }).catch(() => {}).finally(() => {
      this.setState({ loaded: true });
    });
  }

  render() {
    if (this.state.loaded) {
      return (
          <Router>
            <Header />
            <main className="container">
              <Switch>
                <Route exact path="/" component={ Home } />
                <Route exact path="/credits" component={ Credits } />
                <Route exact path="/auth/login" component={ Login } />
                <Route exact path="/activate" component={ ActivateAccount } />
                <Route exact path="/live-results" component={ LiveResults } />
                <PrivateRoute exact
                              path="/reset-password"
                              canAccess={ [UserRole.voter, UserRole.election_officer, UserRole.administrator] }
                              component={ ResetPassword } />
                <PrivateRoute exact
                              path="/manage/users"
                              canAccess={ [UserRole.administrator, UserRole.election_officer] }
                              component={ UserList } />
                <PrivateRoute exact
                              path="/manage/users/new"
                              canAccess={ [UserRole.administrator, UserRole.election_officer] }
                              component={ UserCreate } />
                <PrivateRoute exact
                              path="/manage/users/:userId"
                              canAccess={ [UserRole.administrator, UserRole.election_officer] }
                              component={ UserUpdate } />
                <PrivateRoute exact
                              path="/manage/election"
                              canAccess={ [UserRole.administrator, UserRole.anonymous] }
                              component={ Election } />
                <PrivateRoute exact
                              path="/vote"
                              canAccess={ [UserRole.voter] }
                              component={ Vote } />
                <Route path="*" component={ NotFound } />
              </Switch>
            </main>
            <footer className="container">
              <hr />
              CSCC09 Project
            </footer>
          </Router>
      );
    } else {
      return (
          <div className="page-loading">
            Loading...
          </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
