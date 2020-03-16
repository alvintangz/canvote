import './Vote.scss';
import React, { Component, useState } from 'react';
import { User } from "../../../interfaces/user";
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
        getVoterByEmail(email: $email) {
            district
        }
    }
`;



function Vote(props: Props) {

    
    const [politicalParties, setPoliticalParties] = useState([]);
    const {loading, error, data} = useQuery(GET, {errorPolicy: 'all', variables: {email: props.currentUser.email }});
    
    let candFiltered = []

    if (data) {
        console.log(data)
        candFiltered = data["getPoliticalPartyCandidates"].filter(c => {
            return c.district == data["getVoterByEmail"].district
        })
        console.log( data["getVoterByEmail"].district);
        console.log(data["getPoliticalPartyCandidates"]);

        console.log(candFiltered);
    }

    return (
        <div>
            <h1>Choose your candidate</h1>
            {
                data ? data["getPoliticalPartyCandidates"].filter((candidate) => candidate.district === data["getVoterByEmail"].id).map(candidate => (
                    <div>
                        { candidate.name }
                    </div>
                )) : "Loading..."
            }

            
        </div>
    );
}

export default connect(mapStateToProps)(Vote);
