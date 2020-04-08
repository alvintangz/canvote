// import React, { Component } from 'react';
import React, { useState } from 'react';

import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";

const UPDATE_DISTRICT = gql`
    mutation updateDistrict($id: ID!, $name: String!) {
        updateDistrict(id: $id, name: $name) {
            name
            id
        }
    }
`;

const GET_DISTRICT = gql`
    query getDistrict($id: ID!) {
        getDistrict(id: $id) {  
            name
            id   
        }
    }
`;

export default function DistrictUpdate(props) {

    const [name, setName] = useState("");
    const [updateDistrict] = useMutation(UPDATE_DISTRICT, {errorPolicy: 'all'});
    const {loading, error, data} = useQuery(GET_DISTRICT, {errorPolicy: 'all', variables: {id: props.match.params.districtId}});

    if (data) {
        console.log(data)
    }
    if (error) {
        console.log(error)
    }

    function handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
        setName(event.currentTarget.value)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        updateDistrict({ variables: { 
            name: name === "" ? data['getDistrict'].name : name,
            id: props.match.params.districtId }})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))

      
    }

    return (
        <div>
            <h1>Update District</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        District name:
                        <input type="text" className="form-control" value={data && !name ? data['getDistrict'].name : name} onChange={handleNameChange} required />
                    </label>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    );
}
