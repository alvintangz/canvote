import React,{useState, useEffect} from 'react';
import {loader} from "graphql.macro";
import {PoliticalParty} from "../../interfaces/models";
import {useQuery, useMutation} from "@apollo/react-hooks";
import {AlertType} from "../../enums/alert-type";
import {ApolloErrorAlert, GenericAlert, FilePicker, Loading } from "../shared";
import {SketchPicker} from 'react-color';
import { ApolloError } from 'apollo-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faSave} from '@fortawesome/free-solid-svg-icons';

// GraphQL Queries

const LIST_POLITICAL_PARTIES = loader('./queries/listPoliticalParties.gql');
const CREATE_POLITICAL_PARTY = loader('./queries/createPoliticalParty.gql');
const UPDATE_POLITICAL_PARTY = loader('./queries/updatePoliticalParty.gql');
const DELETE_POLITICAL_PARTY = loader('./queries/deletePoliticalParty.gql');

// Interfaces

interface ListPoliticalPartiesProps {
    // A list of political parties. If none provided, retrieves all parties.
    politicalParties?: PoliticalParty[];
    // Make clickable (cursor pointer)
    clickable?: boolean;
    // If a political party is clicked on, call this
    onClickPoliticalParty?: (politicalParty: PoliticalParty) => void;
    // TODO
    mapPoliticalPartyWithStatistics?: Map<string, number>;
}

interface UpdatePoliticalPartyProps {
    // The political party to update. If no party is provided, creates a new one.
    toUpdate?: PoliticalParty;
    // When the political party has been updated successfully, call this
    onUpdateSuccess?: (party: PoliticalParty, message: { jsx: React.ReactNode, plain: string }) => void;
    // When the political party has been deleted successfully, call this
    onDeleteSuccess?: () => void;
}

// Components

/**
 * Component that lists out the political parties.
 */
export const ListPoliticalParties = (props: ListPoliticalPartiesProps) => {
    const { loading, error, data } = useQuery<{ politicalParties: PoliticalParty[] }>(LIST_POLITICAL_PARTIES, { skip: !!props.politicalParties });

    // Handle specific cases
    if (loading) return (<Loading />);
    if (error) return (<GenericAlert message="There was an error loading political parties. If this error persists, please contact support."
                                     type={ AlertType.danger } />);
    if ((data && data.politicalParties.length === 0) || (props.politicalParties && props.politicalParties.length === 0))
                                     return (<GenericAlert message="There are no political parties at the moment." type={ AlertType.info } />);

    const politicalParties: Array<PoliticalParty | null> = data ? data.politicalParties : (props.politicalParties ? props.politicalParties : null);

    return (
        <ul className="pp-list">
            {
                politicalParties && politicalParties.map((party: PoliticalParty) => (
                    <li key={party.id} 
                        title={ party.name }
                        className={ props.clickable ? "clickable" : "" }
                        onClick={ () => (props.onClickPoliticalParty && props.onClickPoliticalParty(party)) }
                        style={ { borderColor: party.colour } }>
                        <div className="pp-item--logo" style={ { borderBottomColor: party.colour } }>
                            <img src={ process.env.REACT_APP_VOTING_SERVICE_BASE_URL + party.logo.location }
                                    alt={ party.name } />
                        </div>
                        <div className="pp-item--info">
                            <h3 className="h4" style={ { color: party.colour } }>{ party.name }</h3>
                        </div>
                    </li>
                ))
            }
        </ul>
    );
};

/**
 * Component that updates a political party from the props. If no political party is provided, it creates a new one
 * on submit. If there is one provided, there is an option to delete as well.
 */
export const UpdatePoliticalParty = (props: UpdatePoliticalPartyProps) => {
    // Set states
    const [name, setName] = useState<string>('');
    const [colour, setColour] = useState<string>('');
    // TODO: Ensure that logo can be uploaded optionally when updating
    const [logo, setLogo] = useState<File | null>(null);
    const [toUpdate, setToUpdate] = useState<PoliticalParty | null>(null);

    // Apollo hooks for mutations with error states
    const [createPP, { loading: loadingCreate, data: dataCreate }] = useMutation<{ createPoliticalParty: PoliticalParty }>(CREATE_POLITICAL_PARTY);
    const [errorCreate, setErrorCreate] = useState<ApolloError | null>(null);
    const [updatePP, { loading: loadingUpdate, data: dataUpdate }] = useMutation<{ updatePoliticalParty: PoliticalParty }>(UPDATE_POLITICAL_PARTY);
    const [errorUpdate, setErrorUpdate] = useState<ApolloError | null>(null);
    const [deletePP, { loading: loadingDelete, data: dataDelete }] = useMutation<{ deletePoliticalParty: PoliticalParty }>(DELETE_POLITICAL_PARTY);
    const [errorDelete, setErrorDelete] = useState<ApolloError | null>(null);

    // When the props change, reset name, colour, logo and toUpdate itself
    useEffect(() => {
        if (props.toUpdate && props.toUpdate.logo && props.toUpdate.logo.location) {
            // Deep clone hack
            const toUpdateClone = JSON.parse(JSON.stringify(props.toUpdate));
            // Update the location of the logo to full absolute path
            toUpdateClone.logo.location = `${process.env.REACT_APP_VOTING_SERVICE_BASE_URL}${props.toUpdate.logo.location}`;
            setToUpdate(toUpdateClone);
        }

        setName(props.toUpdate && props.toUpdate.name ? props.toUpdate.name : '');
        setColour(props.toUpdate && props.toUpdate.colour ? props.toUpdate.colour : '');
        setLogo(null);
    }, [props.toUpdate]);

    const handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        if (props.toUpdate) {
            updatePP({ variables: { id: props.toUpdate.id, name, colour, logo } })
                .then((data) => {
                    if (props.onUpdateSuccess) {
                        props.onUpdateSuccess(data.updatePoliticalParty as PoliticalParty, {
                            jsx: (<span>The political party, <strong>{ (data.updatePoliticalParty as PoliticalParty).name}</strong>, has been updated in the election.</span>),
                            plain: `The political party, ${(data.updatePoliticalParty as PoliticalParty).name}, has been updated in the election.`
                        })
                    }
                }).catch(error => setErrorUpdate(error));
        } else {
            createPP({ variables: { name, colour, logo } })
                .then((data) => {
                    if (props.onUpdateSuccess) {
                        props.onUpdateSuccess(data.createPoliticalParty as PoliticalParty, {
                            jsx: (<span>The political party, <strong>{ (data.createPoliticalParty as PoliticalParty).name}</strong>, has been added to the election.</span>),
                            plain: `The political party, ${(data.createPoliticalParty as PoliticalParty).name}, has been added to the election.`
                        })
                    }
                }).catch(error => setErrorCreate(error));
        }
    };

    const handleDelete = (): void => {
        if (props.toUpdate) {
            // Function to update the in-memory cache
            const updateCache = (client) => {
                const data = client.readQuery({ query: LIST_POLITICAL_PARTIES });
                const newData = { politicalParties: data.politicalParties.filter((i) => i.id !== props.toUpdate.id) };
                client.writeQuery({
                    query: LIST_POLITICAL_PARTIES,
                    data: newData,
                });
            };

            deletePP({ variables: { id: props.toUpdate.id }, update: updateCache })
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
                                <span>The political party, <strong>{ (dataCreate.createPoliticalParty as PoliticalParty).name}</strong>, has been added to the election.</span>
                              ) : (
                                dataUpdate ? (
                                    <span>The political party, <strong>{ (dataUpdate.updatePoliticalParty as PoliticalParty).name}</strong>, has been updated in the election.</span>
                                ) : (
                                  dataDelete && <span>The political party, <strong>{ toUpdate.name }</strong>, has been deleted in the election.</span>
                                )
                              )
                          }
                          type={ AlertType.success } />
            {
                !dataDelete && (
                    <form onSubmit={ handleSubmit }>
                        <div className="form-group">
                            <label className="required">
                                Name of Political Party
                                <input type="text"
                                    className="form-control"
                                    value={ name }
                                    onChange={ event => setName(event.target.value) }
                                    required />
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="required">
                                Colour of Political Party
                                <SketchPicker color={ colour }
                                            onChange={ (colour) => setColour(colour.hex) }
                                            disableAlpha={ true }
                                            presetColors={ [
                                                { color: '#D71920', title: 'Liberal Red' },
                                                { color: '#1D4880', title: 'Conservative Blue' },
                                                { color: '#F58220', title: 'NDP Orange' },
                                                { color: '#3D9B35', title: 'Green Party Green' },
                                            ]} />
                            </label>
                        </div>
                        <FilePicker label="Logo"
                                    required
                                    presetFile={ toUpdate ? toUpdate.logo : null }
                                    accept="image/jpg,image/png,image/jpeg,image/gif"
                                    onFileSelected={ (file) => setLogo(file) } />
                        {
                            toUpdate ? (
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
