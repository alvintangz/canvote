// import React, { Component } from 'react';
import React, { useState } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation } from "@apollo/react-hooks";
import { User } from '../../../interfaces/user';

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
    const [colour, setColour] = useState("#ffffff");
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
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
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
                        <HuePicker color={colour} onChangeComplete={handleColourChange}/>
                    </label>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    );
}
