import React, { Component, useState } from 'react';
import { User } from "../../interfaces/user";
import {connect} from "react-redux";
import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";



const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

interface Props {
    currentUser: User;
}


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

const GET = gql`
    query getVoterByEmail($email: String!) {
        getPoliticalPartyCandidates {            
            id
            name
            political_party
            district
        }
        districts {
            id
            name
        }
        getVoterByEmail(email: $email) {
            district
        }
    }
`;

const CREATE_VOTE = gql`
    mutation addVote($voter: String!, $candidate: String!) {
        addVote(voter: $voter, candidate: $candidate) {
            voter
            candidate
        }
    }
`;


function Vote(props: Props) {


    const [candidateChosen, setCandidateChosen] = useState('');
    const {loading, error, data} = useQuery(GET, {errorPolicy: 'all', variables: {email: props.currentUser.email }});
    const [addVote] = useMutation(CREATE_VOTE, {errorPolicy: 'all'});

    let candFiltered = []


    if (data) {
        let distIndex = data["getDistricts"].findIndex(obj => obj.id === data["getVoterByEmail"].district)

        candFiltered = data["getPoliticalPartyCandidates"].filter(c => {
            return c.district == data["getDistricts"][distIndex].name
        })

        console.log(candFiltered);
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        addVote({ variables: { candidate: candidateChosen, voter: props.currentUser.email }})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))

    }

    function handleCandidateChange(event: React.FormEvent<HTMLInputElement>): void {
        setCandidateChosen(event.currentTarget.id)
    }
    return (
        <div>
            <h1>Choose your candidate</h1>
            {
                data ? (
                    <form onSubmit={handleSubmit}>
                        {
                            candFiltered.map(c => {
                                return (
                                <div className="radio" key={c.id}>
                                    <label>
                                        <input type="radio" name="optradio" id={c.id} onChange={handleCandidateChange}/>
                                        {c.name} (from party {c.political_party})
                                    </label>
                                </div>)
                            })
                        }
                        <input type="submit" className="btn btn-primary" value="Submit" />
                    </form>

                )

                : 'Loading...'
            }


        </div>
    );
}

export default connect(mapStateToProps)(Vote);
