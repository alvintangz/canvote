import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import Login from "./components/pages/Login/Login";
import ResetPassword from "./components/pages/ResetPassword/ResetPassword";
import ActivateAccount from "./components/pages/ActivateAccount/ActivateAccount";
import LiveResults from "./components/pages/LiveResults/LiveResults";
import Credits from "./components/pages/Credits/Credits";
import UserList from "./components/pages/UserList/UserList";
import UserCreate from "./components/pages/UserCreate/UserCreate";
import PoliticalPartyCreate from "./components/pages/UserCreate/PoliticalPartyCreate/PoliticalPartyCreate";
import UserUpdate from "./components/pages/UserUpdate/UserUpdate";
import Vote from "./components/pages/Vote/Vote";
import NotFound from "./components/pages/NotFound/NotFound";
import meApi from './api/me';
import {AxiosResponse} from "axios";
import {User} from "./interfaces/user";
import {AuthActionType} from "./enums/actions/auth.types";
import {connect} from "react-redux";
import PrivateRoute from "./PrivateRoute";
import {UserRole} from "./enums/role";
import Header from "./components/Header";
import Icon from './Icon.png';
import baseApi from './api/base';


const mapStateToProps = state => {
  return ({currentUser: state.authReducer.user});
};

const mapDispatchToProps = dispatch => ({
  onLoggedIn: (user) =>
      dispatch({ type: AuthActionType.USER_AUTHENTICATED_FROM_CHECK, user }),
  onInvalidAuth: () =>
      dispatch({ type: AuthActionType.INVALID_AUTH })
});

interface Props {
  onLoggedIn: (user: User) => void;
  onInvalidAuth: () => void;
  currentUser: User;
}

interface State {
  loaded: boolean;
}

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    meApi.retrieve().then((response: AxiosResponse<User>) => {
      this.props.onLoggedIn(response.data);
      // TODO: Now listen in on 401 and log out
      baseApi.onError(error => {
        if (error.code === "401") this.props.onInvalidAuth();
      })
    }).finally(() => {
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
                <Route exact path="/" component={Home} />
                <Route exact path="/credits" component={Credits} />
                <Route exact path="/auth/login" component={Login} />
                <Route exact path="/activate" component={ActivateAccount} />
                <Route exact path="/live-results" component={LiveResults} />
                <PrivateRoute exact
                              path="/reset-password"
                              currentUser={this.props.currentUser}
                              canAccess={[UserRole.voter, UserRole.election_officer, UserRole.administrator]}
                              component={ResetPassword} />
                <PrivateRoute exact
                              path="/manage/users"
                              currentUser={this.props.currentUser}
                              canAccess={[UserRole.administrator, UserRole.election_officer]}
                              component={UserList} />
                <PrivateRoute exact
                              path="/manage/users/new"
                              currentUser={this.props.currentUser}
                              canAccess={[UserRole.administrator, UserRole.election_officer]}
                              component={UserCreate} />
                <PrivateRoute exact
                              path="/manage/users/:userId"
                              currentUser={this.props.currentUser}
                              canAccess={[UserRole.administrator, UserRole.election_officer]}
                              component={UserUpdate} />
                <PrivateRoute exact
                              path="/vote"
                              currentUser={this.props.currentUser}
                              canAccess={[UserRole.voter]}
                              component={Vote} />
                <Route path="*" component={NotFound} />
              </Switch>
            </main>
            <footer className="container">
              <hr />
              Footer
            </footer>
          </Router>
      );
    } else {
      return (
          <div className="loading">
            Loading...
          </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
