import React from 'react';
import ReactDOM from 'react-dom';

class RadioForm extends React.Component {
 constructor(props) {
   super(props);
   this.state = {vote:''};

   this.handleVoteChange = this.handleVoteChange.bind(this);
   this.handleVote = this.handleVote.bind(this);
 }

 handleVoteChange(event) {
   this.setState({vote: event.target.value});
 }


 handleVote(event) {
   console.log("vote " + this.state.vote);
   //api.vote(this.state.vote);
   event.preventDefault();
 }


 render() {
   return (
     <form onSubmit={this.handleSubmit}>
       <div>
         Vote for:
         <div className="radio">
            <input type="radio" value="option1" onChange={this.handleVoteChange} checked={this.state.vote === "option1"}/>
            Option 1
         </div>
         <div className="radio">
            <input type="radio" value="option2" onChange={this.handleVoteChange} checked={this.state.vote === "option2"}/>
            Option 2
         </div>
         <div className="radio">
            <input type="radio" value="option3" onChange={this.handleVoteChange} checked={this.state.vote === "option3"}/>
            Option 3
         </div>
       </div>
       <button onClick={this.handleVote} className="btn btn-primary">Vote</button>
     </form>
   );
 }
}

ReactDOM.render(<RadioForm />, document.getElementById('radioform'));