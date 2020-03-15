// import React, { Component } from 'react';
import React, { useState, useEffect } from 'react';

import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { User } from '../../../interfaces/user';
import { Link } from "react-router-dom";


const GET_POLITICAL_PARTY_CANDIDATES = gql`
    query {
        getPoliticalPartyCandidates {            
            id
            name
            political_party
            district
        }
    }
`;

const DELETE_POLITICAL_PARTY_CANDIDATE = gql`
    mutation deletePoliticalPartyCandidate($id: ID!) {
        deletePoliticalPartyCandidate(id: $id) {
            id
            name
            political_party
            district
        }
    }
`;


export default function PPCandidateList(props) {

    const [politicalParties, setPoliticalParties] = useState([]);
    const {loading, error, data} = useQuery(GET_POLITICAL_PARTY_CANDIDATES, {errorPolicy: 'all'});
    const [deletePoliticalPartyCandidate] = useMutation(DELETE_POLITICAL_PARTY_CANDIDATE, {errorPolicy: 'all'})


    if (data) {
        console.log(data)
    }

    function deleteRow(e) {
        let r = window.confirm("Are you sure you want to delete this?");
        if (r) {
            deletePoliticalPartyCandidate({ variables: { id: e }})
                .then((res) => window.location.reload())
                .catch((err) => console.log(err))
        }
    }
  


    return (
        <div>
            {data? <div>
                    <h2>Political Party Candidate Listing</h2>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Political Party</th>
                            <th>District</th>

                        </tr>
                        </thead>
                        <tbody>
                            {
                                data['getPoliticalPartyCandidates'].map((row) => {
                                    return (
                                        <tr key={row.id}>
                                            <td> {row.name} </td>
                                            <td> {row.political_party} </td>
                                            <td> {row.district} </td>

                                            <td>
                                                <Link to={`/manage/candidates/${row.id}`}>
                                                    <button type="button" className="btn btn-primary">Edit</button>
                                                </Link>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-danger" onClick={() => deleteRow(row.id)}>Delete</button>
                                            
                                            </td>
                                        </tr>
                                    )
                                })
                            }                        
                        </tbody>
                    </table>
            </div> 
            
            : "Loading..."}
            

        </div>
       
    );
}
