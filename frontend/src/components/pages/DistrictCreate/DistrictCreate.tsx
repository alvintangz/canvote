// import React, { Component } from 'react';
import React, { useState } from 'react';

import gql from 'graphql-tag';
import { useMutation } from "@apollo/react-hooks";

const CREATE_DISTRICT = gql`
    mutation addDistrict($name: String!) {
        addDistrict(name: $name) {
            name
        }
    }
`;

export default function DistrictCreate(props) {

    const [name, setName] = useState("");
    const [addDistrict] = useMutation(CREATE_DISTRICT, {errorPolicy: 'all'});

    function handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
        setName(event.currentTarget.value)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        addDistrict({ variables: { name: name}})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <h1>Create District</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        District Name:
                        <input type="text" className="form-control" value={name} onChange={handleNameChange} required/>
                    </label>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    );
}
