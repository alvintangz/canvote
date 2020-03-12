 import React from 'react';
 import ReactDOM from 'react-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password:''};

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSignup(event) {
    console.log("signup");
    //api.signup(this.state.username, this.state.password);
    window.location.href="/admin.html";
    event.preventDefault();
  }

  handleSignin(event) {
    console.log("signin");
    //api.signin(this.state.username, this.state.password);
    window.location.href="/home.html";
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <label>
          <div className="form-group">
            Username:
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          </div>
          <div className="form-group">
            Password:
            <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </div>
        </label>
        <div className="form-group">
          <button onClick={this.handleSignup} className="btn btn-default">Sign up</button>
          or
          <button onClick={this.handleSignin} className="btn btn-primary">Sign in</button>
        </div>
      </form>
    );
  }
}

ReactDOM.render(<LoginForm />, document.getElementById('loginform'));