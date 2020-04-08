import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ActivateAccount from "./pages/ActivateAccount";
import LiveResults from "./components/pages/LiveResults/LiveResults";
import Credits from "./pages/Credits";
import UserList from "./pages/UserList";
import UserCreate from "./pages/UserCreate";
import PoliticalPartyList from "./components/pages/PoliticalPartyList";
import PoliticalPartyCreate from "./components/PoliticalPartyCreate";
import PoliticalPartyUpdate from "./components/pages/PoliticalPartyUpdate";
import PPCandidateList from "./components/pages/PPCandidateList";
import PPCandidateCreate from "./components/pages/PPCandidateCreate";
import PPCandidateUpdate from "./components/pages/PPCandidateUpdate";
import DistrictCreate from "./components/pages/DistrictCreate";
import UserUpdate from "./pages/UserUpdate";
import Vote from "./components/pages/Vote";
import NotFound from "./pages/NotFound";
import meApi from './api/me';
import {AxiosResponse} from "axios";
import {User} from "./interfaces/user";
import {AuthActionType} from "./enums/actions/auth.types";
import {connect} from "react-redux";
import PrivateRoute from "./PrivateRoute";
import {UserRole} from "./enums/role";
import Header from "./components/Header/Header";
import baseApi from './api/base';
import { onNetworkError } from './api/apolloClient';
import DistrictList from './components/pages/DistrictList';
import DistrictUpdate from './components/pages/DistrictUpdate';
import { Election } from './pages/Election';


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

      // onNetworkError({ } => {

      // });

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
                {/* <PrivateRoute exact
                              path="/reset-password"
                              canAccess={[UserRole.voter, UserRole.election_officer, UserRole.administrator]}
                              component={ResetPassword} />
                <PrivateRoute exact
                              path="/manage/users"
                              canAccess={[UserRole.administrator, UserRole.election_officer]}
                              component={UserList} />
                <PrivateRoute exact
                              path="/manage/users/new"
                              canAccess={[UserRole.administrator, UserRole.election_officer]}
                              component={UserCreate} />
                <PrivateRoute exact
                              path="/manage/users/:userId"
                              canAccess={[UserRole.administrator, UserRole.election_officer]}
                              component={UserUpdate} />
                <PrivateRoute exact
                              path="/manage/parties"
                              canAccess={[UserRole.administrator]}
                              component={PoliticalPartyList} />
                <PrivateRoute exact
                              path="/manage/parties/new"
                              canAccess={[UserRole.administrator]}
                              component={PoliticalPartyCreate} />
                <PrivateRoute exact
                              path="/manage/parties/:userId"
                              canAccess={[UserRole.administrator]}
                              component={PoliticalPartyUpdate} /> */}
                <PrivateRoute exact
                              path="/manage/election"
                              canAccess={[UserRole.administrator, UserRole.anonymous]}
                              component={Election} />
                {/* <PrivateRoute exact
                              path="/manage/districts/:districtId"
                              canAccess={[UserRole.administrator]}
                              component={DistrictUpdate} />
                <PrivateRoute exact
                              path="/manage/candidates"
                              canAccess={[UserRole.administrator]}
                              component={PPCandidateList} />
                <PrivateRoute exact
                              path="/manage/candidates/new"
                              canAccess={[UserRole.administrator]}
                              component={PPCandidateCreate} />
                <PrivateRoute exact
                              path="/manage/candidates/:candidateId"
                              canAccess={[UserRole.administrator]}
                              component={PPCandidateUpdate} />
                <PrivateRoute exact
                              path="/vote"
                              canAccess={[UserRole.voter]}
                              component={Vote} /> */}
                <Route path="*" component={NotFound} />
              </Switch>
            </main>
            <footer className="container">
              <hr />
              CSCC69 Project
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
