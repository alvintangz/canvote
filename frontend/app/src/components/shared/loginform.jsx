// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

// class LoginForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { username: '', password: '' };
//     }
    
//     changeHandler = (e) => {
//         this.setState({username: e.target.value});
//     }

//     render() {
//       return (
//         <div className="container">
//         <div className="row">
//           <div className="col-lg-8 text-right">
//               <form onSubmit={this.submit}>
//                   <input type="text" id="username" name="username" onChange={this.changeHandler} placeholder="Enter your username" ref={node => (this.inputNode = node)}></input>
//                   <input type="password" id="password" name="password" placeholder="Enter your password" ></input>
//                   <input type="submit" id="loginbtn" className="btn btn-primary"></input>
//               </form>
//           </div>
//         </div>
//       </div>
//       );
//     }
//   }
// ReactDOM.render(<LoginForm />, document.getElementById('loginform'));
// import React from 'react';
// import ReactDOM from 'react-dom';

// class NameForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {value: ''};

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event) {
//     this.setState({value: event.target.value});
//   }

//   handleSubmit(event) {
//     alert('A name was submitted: ' + this.state.value);
//     event.preventDefault();
//   }

//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label>
//           Name:
//           <input type="text" value={this.state.value} onChange={this.handleChange} />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     );
//   }
// }

// ReactDOM.render(<NameForm />, document.getElementById('loginform'));
