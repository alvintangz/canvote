// import React, { Component } from 'react';
import React, { useState } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation } from "@apollo/react-hooks";
import { User } from '../../../interfaces/user';

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
    const [errors, setErrors] = useState([]);
    const [created, setCreated] = useState(null);

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
            .then(() => {
                setCreated({ name: candidateName, party: politicalPartyName, district: district });
                setPoliticalPartyName('');
                setDistrict('');
                setCandidateName('');
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
            <h1>Create Political Party Candidate</h1>
            {
                errors.length > 0 ?
                <div className="alert alert-danger">
                    <h2>Problem Creating Candidate</h2>
                    { errors.map((err) => <p>{err}</p>) }
                </div>
                : null
            }
            {
                created ?
                <div className="alert alert-success">
                    <h2>Candidate Created</h2>
                    <p>A candidate by the name of { created.name }, representing the party { created.party } in the district { created.district } has been created. </p>
                </div>
                : null
            }
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
