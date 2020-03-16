// import React, { Component } from 'react';
import React, { useState, useEffect } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { User } from '../../../interfaces/user';

const UPDATE_POLITICAL_PARTY = gql`
    mutation updatePoliticalParty($id: ID!, $name: String!, $colour: String!) {
        updatePoliticalParty(id: $id, name: $name, colour: $colour) {
            name
            colour
            id
        }
    }
`;

const GET_POLITICAL_PARTY = gql`
    query getPoliticalParty($id: ID!) {
        getPoliticalParty(id: $id) {  
            name       
            colour    
            id        
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

export default function UpdatePoliticalParty(props) {

    const [politicalPartyName, setPoliticalPartyName] = useState("");
    const [colour, setColour] = useState("#ffffff");
    const [updatePoliticalParty] = useMutation(UPDATE_POLITICAL_PARTY, {errorPolicy: 'all'})

    const {loading, error, data} = useQuery(GET_POLITICAL_PARTY, {errorPolicy: 'all', variables: {id: props.match.params.userId}});


    if (data) {
        console.log(data)
    }
    if (error) {
        console.log(error)
    }

    function handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
        setPoliticalPartyName(event.currentTarget.value)
    }

    function handleColourChange(event: any): void {
        setColour(event.hex)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        updatePoliticalParty({ variables: { 
            name: politicalPartyName === "" ? data['getPoliticalParty'].name : politicalPartyName,
            colour: colour === "" ? data['getPoliticalParty'].colour : colour,
            id: props.match.params.userId }})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }


    return (
        <div>
            <h1>Update Political Party</h1>
            {!data ? 'Loading...' : 
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Political Party Name:
                            <input type="text" className="form-control"
                            placeholder="Political Party name" value={data && !politicalPartyName ? data['getPoliticalParty'].name : politicalPartyName}
                            onChange={handlePoliticalPartyChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Political Party Colour:
                            <HuePicker color={colour} onChangeComplete={handleColourChange}/>
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            }
        </div>
    );
}
