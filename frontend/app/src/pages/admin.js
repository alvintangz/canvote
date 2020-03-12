import React from 'react';
import ReactDOM from 'react-dom';

class AddUserForm extends React.Component {
 constructor(props) {
   super(props);
   this.state = {username: ''};

   this.handleUsernameChange = this.handleUsernameChange.bind(this);
   this.handleAddUser = this.handleAddUser.bind(this);
 }

 handleUsernameChange(event) {
   this.setState({username: event.target.value});
 }


 handleAddUser(event) {
   console.log("user added: " + this.state.username);
   //api.signup(this.state.username, this.state.password);
   event.preventDefault();
 }

 render() {
   return (
     <form onSubmit={this.handleAddUser}>
       <label>
         Add user:
         <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
       </label>
       <input type="submit" value="Add user" />
     </form>
   );
 }
}

ReactDOM.render(<AddUserForm />, document.getElementById('adduserform'));