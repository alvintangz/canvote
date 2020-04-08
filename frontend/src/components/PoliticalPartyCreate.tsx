// import React, { Component } from 'react';
import React, { useState } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation } from "@apollo/react-hooks";
import { User } from '../interfaces/user';

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
    const [errors, setErrors] = useState([]);
    const [created, setCreated] = useState(null);


    function handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
        setPoliticalPartyName(event.currentTarget.value)
    }

    function handleColourChange(event: any): void {
        setColour(event.hex)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        addPoliticalParty({ variables: { name: politicalPartyName, colour: colour }})
            .then(() => {
                setCreated({ politicalPartyName: politicalPartyName });
                setPoliticalPartyName('');
                setErrors([]);
            })
            .catch((err) => {
                console.log(err.graphQLErrors);
                setCreated(null);
                setErrors(err.graphQLErrors.map((e) => e.message));
            });
        }

    return (
        <div>
            <h1>Create Political Party</h1>
            {
                errors.length > 0 ?
                <div className="alert alert-danger">
                    <h2>Problem Creating Party</h2>
                    { errors.map((err) => <p>{err}</p>) }
                </div>
                : null
            }
            {
                created ?
                <div className="alert alert-success">
                    <h2>Political Party Created</h2>
                    <p>A political party by the name of { created.politicalPartyName } has been created. </p>
                </div>
                : null
            }
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
