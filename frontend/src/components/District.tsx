import React, {useEffect, useState} from 'react';
import {loader} from 'graphql.macro';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {District, PoliticalParty} from '../interfaces/models';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import {AlertType} from '../enums/alert-type';
import { ApolloError } from 'apollo-client';
import {ApolloErrorAlert, GenericAlert, Loading } from "./shared";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faSave} from '@fortawesome/free-solid-svg-icons';

// GraphQL Queries

const LIST_DISTRICT = loader('../queries/listDistrict.gql');
const CREATE_DISTRICT = loader('../queries/createDistrict.gql');
const UPDATE_DISTRICT = loader('../queries/updateDistrict.gql');
const DELETE_DISTRICT = loader('../queries/deleteDistrict.gql');

// Interfaces

interface ListDistrictsProps {
    // A list of districts. If none provided, retrieves all districts.
    districts?: District[];
    // If a district is clicked on, call this
    onClickDistrict?: (district: District) => void;
    // Hide the search bar. By default set to false.
    hideSearchBar?: boolean;
}

interface DisplayDistrictsProps {
    // A list of districts. If none provided, retrieves all districts.
    districts?: District[];
    // When hovering over a district on the map, call this
    onHoverDistrict?: (hoveredDistrict: District) => void;
    // When a district is clicked on in the map, call this
    onClickDistrict?: (selectedDistrict: District) => void;
    // Height of the map. By default set to 550px
    heightOfMap?: string;
    // Map a district (with the id being the key) to the colour of the district to be placed on map
    mapDistrictsWithColours?: Map<string, string>;
}

interface UpdateDistrictProps {
    // The district to update. If no district is provided, creates a new one.
    toUpdate?: District;
    // When the district has been updated successfully, call this
    onUpdateSuccess?: (district: District, message: { jsx: React.ReactNode, plain: string }) => void;
    // When the district has been deleted successfully, call this
    onDeleteSuccess?: () => void;
}

/**
 * Component that lists out the districts in a list group.
 */
export const ListDistricts = (props: ListDistrictsProps) => {
    // State to store the search term when searching
    const [searchTerm, setSearchTerm] = useState<string>("");

    const { loading, error, data } = useQuery<{ districts: District[] }>(LIST_DISTRICT);

    // Handle specific cases
    if (loading) return (<Loading />);
    if (error) return (<GenericAlert message="There was an error loading districts. If this error persists, please contact support."
                                     type={ AlertType.danger } />);
    if (data && data.districts.length === 0)
        return (<GenericAlert message="There are no districts at the moment." type={ AlertType.info } />);

    // Districts must be from Apollo client to retrieve cache changes
    const districts: Array<District> = !props.districts ? data.districts : 
        data.districts.filter((district) => props.districts.findIndex(propsDistrict => propsDistrict.id === district.id) !== -1);

    return (
        <div>
            {
                !props.hideSearchBar && districts && (
                    <input type="text" 
                           className="form-control mb-1" 
                           placeholder="Search districts by name"
                           value={ searchTerm }
                           onChange={ (event) => setSearchTerm(event.target.value) }
                           style={{ width: "100%" }} />
                )
            }
            <div className="list-group">
                { districts && districts.filter((district: District) => district.name.indexOf(searchTerm) !== -1).map((district: District) => (
                    <a key={district.id} href="#" className="list-group-item" onClick={() => props.onClickDistrict && props.onClickDistrict(district) }>{ district.name }</a>
                ))}
                {
                    districts && districts.filter((district: District) => district.name.indexOf(searchTerm) !== -1).length === 0 && <GenericAlert message="There are no districts based off your search query." type={ AlertType.info } />
                }
            </div>
        </div>
    );
};

/**
 * Component that displays districts on a map via each district's GeoJson data.
 */
export const DisplayDistricts = (props: DisplayDistrictsProps) => {
    const MAPBOX_API_KEY: string = process.env.REACT_APP_MAPBOX_API_KEY;
    const MAPBOX_STYLE = process.env.REACT_APP_MAPBOX_MAP_STYLE;
    const DEFAULT_POS: { lat: number, lng: number, zoom: number } = {
        lat: parseFloat(process.env.REACT_APP_MAP_DEFAULT_POS_LAT),
        lng: parseFloat(process.env.REACT_APP_MAP_DEFAULT_POS_LONG),
        zoom: parseInt(process.env.REACT_APP_MAP_DEFAULT_POS_ZOOM)
    };

    const { loading, error, data } = useQuery<{ districts: District[] }>(LIST_DISTRICT, { skip: !!props.districts });

    // Handle specific cases
    if (loading) return (<Loading />);
    if (error) return (<GenericAlert message="There was an error loading districts. If this error persists, please contact support."
                                     type={ AlertType.danger } />);

    const districts: Array<District | null> = data ? data.districts : (props.districts ? props.districts : null);

    return (
        <Map style={{ height: props.heightOfMap ? props.heightOfMap : '550px' }} 
             center={ DEFAULT_POS } 
             zoom={ DEFAULT_POS.zoom } 
             zoomControl={ false }>
            <TileLayer
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                url={ `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}` } />
            {
                districts.map(district => (
                    <GeoJSON
                        key={ district.id }
                        data={ district.geoJson }
                        style={{
                            "color": props.mapDistrictsWithColours && props.mapDistrictsWithColours.has(district.id) ? props.mapDistrictsWithColours.get(district.id) : "red",
                            "opacity": 0.4
                        }}
                        onMouseOver={ () => props.onHoverDistrict && props.onHoverDistrict(district) }
                        onclick={ () => props.onClickDistrict && props.onClickDistrict(district) } />
                ))
            }
        </Map>
    )
};

/**
 * Component that updates a district from the props. If no district is provided, it creates a new one
 * on submit. If there is one provided, there is an option to delete as well.
 */
export const UpdateDistrict = (props: UpdateDistrictProps) => {
    // Set states
    const [name, setName] = useState<string>('');
    const [geoJson, setGeoJson] = useState<string>('');

    // Apollo hooks for mutations with error states
    const [createDistrict, { loading: loadingCreate, data: dataCreate }] = useMutation<{ createDistrict: District }>(CREATE_DISTRICT);
    const [errorCreate, setErrorCreate] = useState<ApolloError | null>(null);
    const [updateDistrict, { loading: loadingUpdate, data: dataUpdate }] = useMutation<{ updateDistrict: District }>(UPDATE_DISTRICT);
    const [errorUpdate, setErrorUpdate] = useState<ApolloError | null>(null);
    const [deleteDistrict, { loading: loadingDelete, data: dataDelete }] = useMutation<{ deleteDistrict: District }>(DELETE_DISTRICT);
    const [errorDelete, setErrorDelete] = useState<ApolloError | null>(null);

    // When the props change, reset name and geojson
    useEffect(() => {
        setName(props.toUpdate && props.toUpdate.name ? props.toUpdate.name : '');
        setGeoJson(props.toUpdate && props.toUpdate.geoJson ? JSON.stringify(props.toUpdate.geoJson) : '');
    }, [props.toUpdate]);

    const handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        if (props.toUpdate) {
            updateDistrict({ variables: { id: props.toUpdate.id, name, geoJson }})
                .then((data) => {
                    if (props.onUpdateSuccess) {
                        props.onUpdateSuccess(data.updateDistrict as District, {
                            jsx: (<span>The district, <strong>{ (data.updateDistrict as District).name}</strong>, has been updated in the election.</span>),
                            plain: `The district, ${(data.updateDistrict as District).name}, has been updated in the election.`
                        })
                    }
                }).catch(error => setErrorUpdate(error));
        } else {
            // Function to update the in-memory cache
            const updateCache = (proxy, { data: { createDistrict }}) => {
                const data = proxy.readQuery({ query: LIST_DISTRICT });
                if (data) {
                    data.districts.push(createDistrict);
                    proxy.writeQuery({ query: LIST_DISTRICT, data });
                }
            };

            createDistrict({ variables: { name, geoJson }, update: updateCache })
                .then((data) => {
                    if (props.onUpdateSuccess) {
                        props.onUpdateSuccess(data.createDistrict as District, {
                            jsx: (<span>The district, <strong>{ (data.createDistrict as District).name}</strong>, has been added to the election.</span>),
                            plain: `The district, ${(data.createDistrict as District).name}, has been added to the election.`
                        })
                    }
                }).catch(error => setErrorCreate(error));
        }
    };

    const handleDelete = (): void => {
        if (props.toUpdate) {
            // Function to update the in-memory cache
            const updateCache = (client) => {
                const data = client.readQuery({ query: LIST_DISTRICT });
                if (data) {
                    const newData = { districts: data.districts.filter((i) => i.id !== props.toUpdate.id) };
                    client.writeQuery({
                        query: LIST_DISTRICT,
                        data: newData,
                    });
                }
            };

            deleteDistrict({ variables: { id: props.toUpdate.id }, update: updateCache })
                .then(() => {
                    if (props.onDeleteSuccess) props.onDeleteSuccess();
                }).catch(error => setErrorDelete(error));
        }
    };

    return (
        <div>
            <ApolloErrorAlert error={ errorCreate ? errorCreate : (errorUpdate ? errorUpdate : errorDelete) } />
            <GenericAlert shouldShow={ dataCreate !== undefined || dataUpdate !== undefined || dataDelete !== undefined }
                          message={
                              dataCreate ? (
                                <span>The district, <strong>{ (dataCreate.createDistrict as PoliticalParty).name}</strong>, has been added to the election.</span>
                              ) : (
                                  dataUpdate ? (
                                      (<span>The district, <strong>{ (dataUpdate.updateDistrict as PoliticalParty).name}</strong>, has been updated in the election.</span>)
                                  ) : (
                                    dataDelete && <span>The district has been deleted in the election.</span>
                                  )
                              )
                              
                          }
                          type={ AlertType.success } />
            {
                !dataDelete && (
                    <form onSubmit={ handleSubmit }>
                        <div className="form-group">
                            <label className="required">
                                District Name
                                <input type="text"
                                    className="form-control"
                                    value={ name }
                                    onChange={ event => setName(event.target.value) }
                                    required />
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="required">
                                GeoJson Multipolygon
                                <textarea className="form-control geojson-mp-ta"
                                        value={ geoJson }
                                        onChange={ event => setGeoJson(event.target.value) }
                                        required />
                            </label>
                            <p className="help-text">Set the <a href="https://geojson.org/geojson-spec.html#multipolygon"
                                                                target="_blank"
                                                                rel="noopener noreferrer">GeoJson multi-polygon</a> of the district.</p>
                        </div>
                        {
                            props.toUpdate ? (
                                <div className="btn-group">
                                    <button type="submit" 
                                            className="btn btn-success" 
                                            disabled={ loadingCreate || loadingUpdate || loadingDelete }>
                                        <FontAwesomeIcon icon={ faSave } className="fa-left" /> Save
                                    </button>
                                    <button className="btn btn-danger" onClick={ handleDelete } disabled={ loadingCreate || loadingUpdate || loadingDelete }>
                                        <FontAwesomeIcon icon={ faTrash } className="fa-left" />Delete
                                    </button>
                                </div>
                            ): (
                                <button type="submit" 
                                        className="btn btn-success" 
                                        disabled={ loadingCreate || loadingUpdate || loadingDelete }>
                                    <FontAwesomeIcon icon={ faSave } className="fa-left" /> Save
                                </button>
                            )
                        }
                    </form>
                )
            }

        </div>
    );
};
