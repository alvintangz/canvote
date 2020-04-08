import React, {useState} from 'react';
import {loader} from 'graphql.macro';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Loading} from '../Loading';
import {District} from '../../models/district';
import Editor from 'react-simple-code-editor';
import {highlight, languages} from 'prismjs/components/prism-core';
import {GenericAlert, GraphQLErrorAlert} from '../Alert';
import {AlertType} from '../../enums/alert-type';
import {GeoJSON, Map, TileLayer} from 'react-leaflet';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';


const LIST_DISTRICT = loader('./graphql/listDistrict.gql');
const CREATE_DISTRICT = loader('./graphql/createDistrict.gql');
const UPDATE_DISTRICT = loader('./graphql/updateDistrict.gql');


interface DisplayDistrictsProps {
    handleHoveredDistrict?: (hoveredDistrict: District) => void;
    handleSelectedDistrict?: (selectedDistrict: District) => void;
    districtColours?: { id: number; colour: string; }[];
    mapHeight?: string;
}


interface UpdateDistrictProps {
    districtToUpdate?: District;
}


/**
 * Displays all the districts on a map.
 *
 * Cool.
 */
const DisplayDistricts = (props: DisplayDistrictsProps) => {
    // TODO: Put somewhere else
    // const accessToken = "pk.eyJ1IjoiYWx2aW50YW5neiIsImEiOiJjazhwMDE1NzcwNGs3M2VueWhmYmxoZDNqIn0.dP93i1KCNDspmpONuLsRCA";
    const accessToken = "fakse";
    const defaultPos = { lat: 56.1304, lng: -106.3468};
    const mapStyle = "alvintangz/ck8p1gfx445tp1jo0153rv86m";

    const [currPos, setCurrentPos] = useState({ lat: defaultPos.lat, lng: defaultPos.lng, zoom: 4 })
    const { loading, error, data } = useQuery(LIST_DISTRICT);

    if (loading) return (<Loading />);
    if (error) return (<GenericAlert shouldShow={true} title="Error" message="Error" type={ AlertType.danger } />);

    return (
        <Map style={{ height: props.mapHeight ? props.mapHeight : '500px' }} center={defaultPos} zoom={currPos.zoom} zoomControl={false}>
            <TileLayer
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                url={ `https://api.mapbox.com/styles/v1/${mapStyle}/tiles/{z}/{x}/{y}?access_token=${accessToken}` } />
            {
                data.districts.map(district => (
                    <GeoJSON
                        key={district.id}
                        data={district.geoJson}
                        style={ { "color": "blue", "opacity": 0.4 } }
                        onMouseOver={ () => props.handleHoveredDistrict && props.handleHoveredDistrict(district) }
                        onclick={ () => props.handleSelectedDistrict && props.handleSelectedDistrict(district) } />
                ))
            }
        </Map>
    )
};

/**
 * Updates a district.
 *
 * If districtToUpdate prop is provided, update the provided district. Otherwise, create.
 */
const UpdateDistrict = (props: UpdateDistrictProps) => {
    const [name, setName] = useState(props.districtToUpdate && props.districtToUpdate.name ? props.districtToUpdate.name : '');
    const [geoJson, setGeoJson] = useState(props.districtToUpdate && props.districtToUpdate.geoJson ? props.districtToUpdate.geoJson : '');
    const [createDistrict, { error: errorCreate, loading: loadingCreate, data: dataCreate }] = useMutation(CREATE_DISTRICT);
    const [updateDistrict, { error: errorUpdate, loading: loadingUpdate, data: dataUpdate }] = useMutation(UPDATE_DISTRICT);

    const handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        if (props.districtToUpdate) {
            updateDistrict({ variables: { id: props.districtToUpdate.id, name, geoJson }});
        } else {
            createDistrict({ variables: { name, geoJson }});
        }
    };

    return (
        <div>
            <GraphQLErrorAlert error={ errorCreate } />
            <GraphQLErrorAlert error={ errorUpdate } />
            <GenericAlert shouldShow={ dataCreate || dataUpdate } title="Success" message="Success" type={ AlertType.success } />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        District Name
                        <input type="text" className="form-control" value={name} onChange={event => setName(event.target.value)} required />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        GeoJson Polygon
                        <Editor
                            value={geoJson}
                            onValueChange={geoJson => setGeoJson(geoJson)}
                            highlight={geoJson => highlight(geoJson, languages.js)}
                            padding={10}
                            style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 12 }} />
                    </label>
                    <p className="help-text">Set the <a href="https://geojson.org/geojson-spec.html#polygon">GeoJson polygon</a> of the district.</p>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" disabled={ loadingCreate || loadingUpdate } />
            </form>
        </div>
    );
};


export { DisplayDistricts, UpdateDistrict };
