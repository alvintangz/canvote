// import React, { Component } from 'react';
import React from 'react';

import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';


const GET_DISTRICTS = gql`
    query {
        getDistricts {            
            id
            name    
        }
    }
`;

const DELETE_DISTRICT = gql`
    mutation deleteDistrict($id: ID!) {
        deleteDistrict(id: $id) {
            id
            name    
        }
    }
`;

export default function DistrictList(props) {
  const { loading, error, data } = useQuery(GET_DISTRICTS, {
    errorPolicy: 'all',
  });
  const [deleteDistrict] = useMutation(DELETE_DISTRICT, { errorPolicy: 'all' });

  if (data) {
    console.log(data);
  }

  function deleteRow(e) {
    const r = window.confirm("Are you sure you want to delete this?");
    if (r) {
      deleteDistrict({ variables: { id: e } })
        .then(() => window.location.reload())
        .catch((err) => console.log(err));
    }
  }

  return (
    <div>
      {data ? (
        <div>
          <h2> Listing Districs</h2>
          <Link to="/manage/districts/new" className="btn-success btn">
            New District
          </Link>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data["getDistricts"].map(row => {
                return (
                  <tr key={row.id}>
                    <td> {row.name} </td>
                    <td>
                      <Link to={`/manage/districts/${row.id}`}>
                        <button type="button" className="btn btn-primary">
                          Edit
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteRow(row.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
