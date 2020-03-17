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
    const [errors, setErrors] = useState([]);
    const [created, setCreated] = useState(null);

    function handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
        setName(event.currentTarget.value)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        addDistrict({ variables: { name: name}})
            .then(() => {
                setCreated({ name: name });
                setName('');
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
            <h1>Create District</h1>
            {
                errors.length > 0 ?
                <div className="alert alert-danger">
                    <h2>Problem Creating District</h2>
                    { errors.map((err) => <p>{err}</p>) }
                </div>
                : null
            }
            {
                created ?
                <div className="alert alert-success">
                    <h2>District Created</h2>
                    <p>A district by the name of { created.name } has been created. </p>
                </div>
                : null
            }
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
