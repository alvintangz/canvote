import React, { Component } from 'react';
import { HuePicker } from 'react-color';

import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

 
const client = new ApolloClient({
    uri: process.env.REACT_APP_VOTING_SERVICE_BASE_URL + 'graphql',
    credentials: 'include',

  });




interface Props {
    currentUser: User
}

interface State {
    politicalPartyName: string
    colour: string

}



export class PoliticalPartyCreate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {politicalPartyName: "", colour: "#fff"}
        this.handlePoliticalPartyChange = this.handlePoliticalPartyChange.bind(this);
        this.handleColourChange = this.handleColourChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({politicalPartyName: event.currentTarget.value});
    }

    handleColourChange(colour: any): void {
        console.log("colour change")
        this.setState({ colour: colour.hex });
        // this.setState({politicalPartyName: event.currentTarget.value});
    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        console.log("submitted");

        client.query({
            query: gql`
                {
                getDistricts {
                  id
                }
              }          
            `,
          })
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }
    render() {
        return (
            <div>
                <h1>Create Political Party</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            Political Party Name:
                            <input type="text" className="form-control"
                            placeholder="Political Party name" value={this.state.politicalPartyName} onChange={this.handlePoliticalPartyChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Political Party Colour:
                            <HuePicker color={this.state.colour} onChangeComplete={this.handleColourChange}/>
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default PoliticalPartyCreate;

