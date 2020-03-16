// import React, { Component } from 'react';
import React, { useState } from 'react';

import { HuePicker } from 'react-color';

import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { User } from '../../../interfaces/user';
// hi
const UPDATE_POLITICAL_PARTY_CANDIDATE = gql`
    mutation updatePoliticalPartyCandidate($id: ID!, $name: String!, $political_party: String!, $district: String!) {
        updatePoliticalPartyCandidate(id: $id, name: $name, political_party: $political_party, district: $district) {
            name
            political_party
            district
        }
    }
`;

const GET_POLITICAL_PARTY_CANDIDATE = gql`
    query getPoliticalPartyCandidate($id: ID!) {
        getPoliticalPartyCandidate(id: $id) {  
            name
            political_party    
            district
            id        
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

    const [updatePoliticalPartyCandidate] = useMutation(UPDATE_POLITICAL_PARTY_CANDIDATE, {errorPolicy: 'all'});
    
    const {loading, error, data} = useQuery(GET_POLITICAL_PARTY_CANDIDATE, {errorPolicy: 'all', variables: {id: props.match.params.candidateId}});


    if (data) {
        console.log(data)
    }
    if (error) {
        console.log(error)
    }

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
        // candidateName === "" ? setCandidateName(props.match.params.name) : null
        // district === "" ? handleDistrictChange(props.match.params.district) : null
        // political_party === "" ? handlePoliticalPartyChange(props.match.params.political_party) : null
        console.log(politicalPartyName)
        console.log(props.match.params.political_party)
        console.log(props)
        updatePoliticalPartyCandidate({ variables: { 
            political_party: politicalPartyName === "" ? data['getPoliticalPartyCandidate'].political_party : politicalPartyName,
            name: candidateName === "" ? data['getPoliticalPartyCandidate'].name : candidateName,
            district: district === "" ? data['getPoliticalPartyCandidate'].district : district,
            id: props.match.params.candidateId}})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }


    return (
        <div>
            <h1>Update Political Party Candidate</h1>
            {!data ? 'Loading...' :
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Candidate Name:
                            <input type="text" className="form-control"
                            placeholder="Candidate name" value={data && ! candidateName ? data['getPoliticalPartyCandidate'].name : candidateName} onChange={handleCandidateChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Candidate Party:
                            <input type="text" className="form-control"
                            placeholder="Political Party name" value={data && ! politicalPartyName ? data['getPoliticalPartyCandidate'].political_party : politicalPartyName} onChange={handlePoliticalPartyChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Candidate District:
                            <input type="text" className="form-control"
                            placeholder="District name" value={data && ! district ? data['getPoliticalPartyCandidate'].district : district} onChange={handleDistrictChange} required/>
                        </label>
                    </div>

                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            }
        </div>
    );
}
