// import React, { Component } from 'react';
import React, { useState } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation } from "@apollo/react-hooks";
import { User } from '../../../../interfaces/user';

// mutation submitComment($repoFullName: String!, $commentContent: String!) {
//     submitComment(repoFullName: $repoFullName, commentContent: $commentContent) {
//       postedBy {
//         login
//         html_url
//       }
//       createdAt
//       content
//     }
//   }

const CREATE_POLITICAL_PARTY = gql`
    mutation addPoliticalParty($name: String!, $colour: String!) {
        addPoliticalParty(name: $name, colour: $colour) {
            name
            colour
        }
    }
`;

interface Props {
    currentUser: User;
}

interface State {
    politicalPartyName: string;
    colour: string;
}

export default function PoliticalPartyCreate(props) {

    const [politicalPartyName, setPoliticalPartyName] = useState("");
    const [colour, setColour] = useState("fff");
    const [addPoliticalParty] = useMutation(CREATE_POLITICAL_PARTY, {errorPolicy: 'all'});

    function handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
        setPoliticalPartyName(event.currentTarget.value)
    }

    function handleColourChange(event: any): void {
        setColour(event.hex)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        
        addPoliticalParty({ variables: { name: politicalPartyName, colour: colour }})
            .then((a) => console.log(a))
            .catch((a) => console.log(a))
    }

    
    return (
        <div>
            <h1>Create Political Party</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Political Party Name:
                        <input type="text" className="form-control"
                        placeholder="Political Party name" value={politicalPartyName} onChange={handlePoliticalPartyChange} required/>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Political Party Colour:
                        {/* <input type="color" value={colour} onChange={handleColourChange} /> */}
                        <HuePicker color={colour} onChangeComplete={handleColourChange}/>
                    </label>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    );
}

// export class PoliticalPartyCreate extends Component<Props, State> {
//     constructor(props: Props) {
//         super(props);
//         this.state = {politicalPartyName: "", colour: "#fff"}
//         this.handlePoliticalPartyChange = this.handlePoliticalPartyChange.bind(this);
//         this.handleColourChange = this.handleColourChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
//         this.setState({politicalPartyName: event.currentTarget.value});
//     }

//     handleColourChange(event): void {
//         console.log("colour change")
//         this.setState({ colour: event.value });
//         // this.setState({politicalPartyName: event.currentTarget.value});
//     }

//     handleSubmit(event: React.SyntheticEvent): void {
//         event.preventDefault();
//         const [createPoliticalParty] = useMutation(CREATE_POLITICAL_PARTY);

//         createPoliticalParty({ variables: { name: this.state.politicalPartyName, color: this.state.colour }}).then((res) => {
//             console.log(res);
//         }).catch(err => {
//             console.log(err);
//         });
//     }
//     render() {
//         return (
            
//         );
//     }
// }

// export default PoliticalPartyCreate;

