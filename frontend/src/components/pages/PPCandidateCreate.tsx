// import React, { Component } from 'react';
import React, { useState } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation } from "@apollo/react-hooks";
import { User } from '../../interfaces/user';

const CREATE_POLITICAL_PARTY_CANDIDATE = gql`
    mutation addPoliticalPartyCandidate($name: String!, $political_party: String!, $district: String!) {
        addPoliticalPartyCandidate(name: $name, political_party: $political_party, district: $district) {
            name
            political_party
            district
        }
    }
`;

interface Props {
    currentUser: User;
}

interface State {
    politicalPartyName: string;
    district: string;
    candidateName: string;

}

export default function PoliticalPartyCreate(props) {

    const [politicalPartyName, setPoliticalPartyName] = useState("");
    const [district, setDistrict] = useState("");
    const [candidateName, setCandidateName] = useState("");

    const [addPoliticalPartyCandidate] = useMutation(CREATE_POLITICAL_PARTY_CANDIDATE, {errorPolicy: 'all'});

    function handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
        setPoliticalPartyName(event.currentTarget.value)
    }

    function handleDistrictChange(event: React.FormEvent<HTMLInputElement>): void {
        setDistrict(event.currentTarget.value)
    }

    function handleCandidateChange(event: React.FormEvent<HTMLInputElement>): void {
        setCandidateName(event.currentTarget.value)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        addPoliticalPartyCandidate({ variables: { name: candidateName, political_party: politicalPartyName, district: district}})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }


    return (
        <div>
            <h1>Create Political Party Candidate</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Candidate Name:
                        <input type="text" className="form-control"
                        placeholder="Candidate name" value={candidateName} onChange={handleCandidateChange} required/>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Candidate Party:
                        <input type="text" className="form-control"
                        placeholder="Political Party name" value={politicalPartyName} onChange={handlePoliticalPartyChange} required/>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Candidate District:
                        <input type="text" className="form-control"
                        placeholder="District name" value={district} onChange={handleDistrictChange} required/>
                    </label>
                </div>

                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    );
}
