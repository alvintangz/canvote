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

interface Props {
    currentUser: User;
}

interface State {
    politicalPartyName: string;
    colour: string;
}

export default function PoliticalPartyCreate(props) {

    const [politicalParties, setPoliticalParties] = useState([]);
    const {loading, error, data} = useQuery(GET_POLITICAL_PARTY, {errorPolicy: 'all'});

    if (data) {
        console.log(data)
    }
    // function handlePoliticalPartyChange(event: React.FormEvent<HTMLInputElement>): void {
    //     setPoliticalPartyName(event.currentTarget.value)
    // }

    // function handleColourChange(event: any): void {
    //     setColour(event.hex)
    // }

    // function handleSubmit(event: React.SyntheticEvent): void {
    //     event.preventDefault();

    //     addPoliticalParty({ variables: { name: politicalPartyName, colour: colour }})
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err))
    // }

    useEffect(() => {

        // console.log(data, error, loading);
    }, []);


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
                                        <tr>
                                            <td> {row.name} </td>
                                            <td> <div style={{width: '50px', height:'50px', backgroundColor:`${row.colour}`}}></div> </td>
                                            <td>
                                                <Link to={`/manage/parties/${row.id}`}>
                                                    <button type="button" className="btn btn-primary">Edit</button>
                                                </Link>
                                            </td>
                                            <td><button type="button" className="btn btn-danger">Delete</button></td>

                                        </tr>
                                    )
                                })
                            }                        
                        </tbody>
                    </table>
            </div> 
            
            : "Loading..."}
            

        </div>
        // <div>
        //     <h1>Create Political Party</h1>
        //     <form onSubmit={handleSubmit}>
        //         <div className="form-group">
        //             <label>
        //                 Political Party Name:
        //                 <input type="text" className="form-control"
        //                 placeholder="Political Party name" value={politicalPartyName} onChange={handlePoliticalPartyChange} required/>
        //             </label>
        //         </div>
        //         <div className="form-group">
        //             <label>
        //                 Political Party Colour:
        //                 <HuePicker color={colour} onChangeComplete={handleColourChange}/>
        //             </label>
        //         </div>
        //         <input type="submit" className="btn btn-primary" value="Submit" />
        //     </form>
        // </div>
    );
}
