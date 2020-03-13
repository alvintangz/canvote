import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./components/pages/Home/Home";
import Login from "./components/pages/Login/Login";
import ResetPassword from "./components/pages/ResetPassword/ResetPassword";
import ActivateAccount from "./components/pages/ActivateAccount/ActivateAccount";
import LiveResults from "./components/pages/LiveResults/LiveResults";
import Credits from "./components/pages/Credits/Credits";
import UserList from "./components/pages/UserList/UserList";
import UserCreate from "./components/pages/UserCreate/UserCreate";
import UserUpdate from "./components/pages/UserUpdate/UserUpdate";
import NotFound from "./components/pages/NotFound/NotFound";

function App() {
  return (
    <Router>
      <header>
        <div className="container">
          <div className="row">
            <div className="brand col-xs-5 col-md-4">
              CanVote
            </div>
            <div className="col-lg-8 text-right">
              <Link to="/auth/login" className="btn btn-primary">Log in</Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/auth/login">
            <Login />
          </Route>
          <Route path="/reset-password">
            <ResetPassword />
          </Route>
          <Route path="/activate">
            <ActivateAccount />
          </Route>
          <Route path="/live-results">
            <LiveResults />
          </Route>
          <Route path="/manage/users">
            <UserList />
          </Route>
          <Route path="/manage/users/new">
            <UserCreate />
          </Route>
          <Route path="/manage/users/:userId">
            <UserUpdate />
          </Route>
          <Route path="/credits">
            <Credits />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </main>
      <footer>
        Footer
      </footer>
    </Router>
  );
}

export default App;
