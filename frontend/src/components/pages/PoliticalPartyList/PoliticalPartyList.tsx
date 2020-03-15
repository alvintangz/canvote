// import React, { Component } from 'react';
import React, { useState, useEffect } from 'react';

import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { User } from '../../../interfaces/user';
import { Link } from "react-router-dom";


const GET_POLITICAL_PARTY = gql`
    query {
        getPoliticalParties {            
            id
            name    
            colour    
        }
    }
`;

const DELETE_POLITICAL_PARTY = gql`
    mutation deletePoliticalParty($id: ID!) {
        deletePoliticalParty(id: $id) {
            name
            colour
            id
        }
    }
`;


export default function PoliticalPartyCreate(props) {

    const [politicalParties, setPoliticalParties] = useState([]);
    const {loading, error, data} = useQuery(GET_POLITICAL_PARTY, {errorPolicy: 'all'});
    const [deletePoliticalParty] = useMutation(DELETE_POLITICAL_PARTY, {errorPolicy: 'all'})


    if (data) {
        console.log(data)
    }

    function deleteRow(e) {
        let r = window.confirm("Are you sure you want to delete this?");
        if (r) {
            deletePoliticalParty({ variables: { id: e }})
                .then((res) => window.location.reload())
                .catch((err) => console.log(err))
        }
    }
 
    return (
        <div>
            {data? <div>
                    <h2>Political Party Listing</h2>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Colour</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                data['getPoliticalParties'].map((row) => {
                                    return (
                                        <tr key={row.id}>
                                            <td> {row.name} </td>
                                            <td> <div style={{width:'50px',height:'50px',border:'1px solid black', backgroundColor:`${row.colour}`}}></div> </td>
                                            <td>
                                                <Link to={`/manage/parties/${row.id}`}>
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
