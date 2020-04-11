import React, {useState, useEffect} from 'react';
import {Candidate, District, PoliticalParty} from "../../interfaces/models";
import {loader} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {ApolloErrorAlert, GenericAlert, FilePicker, Loading } from "../shared";
import {AlertType} from "../../enums/alert-type";
import {ApolloError} from "apollo-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faSave} from '@fortawesome/free-solid-svg-icons';

// GraphQL Queries

const LIST_POLITICAL_PARTIES = loader('./queries/listPoliticalParties.gql');
const LIST_CANDIDATES = loader('./queries/listPoliticalPartyCandidates.gql');
const CREATE_CANDIDATE = loader('./queries/createPoliticalPartyCandidate.gql');
const UPDATE_CANDIDATE = loader('./queries/updatePoliticalPartyCandidate.gql');
const DELETE_CANDIDATE = loader('./queries/deletePoliticalPartyCandidate.gql');

// Interfaces

interface ListCandidatesProps {
    // A list of candidates. If none provided, retrieves all candidates.
    candidates?: Candidate[];
    // Make clickable (cursor pointer)
    clickable?: boolean;
    // Make selectable (when a candidate is clicked, a border shows); clickable must be true as well
    selectable?: boolean;
    // If a candidate is clicked on, call this
    onClickCandidate?: (candidate: Candidate) => void;
    // A map of a candidate id to the weight of each progress bar
    mapCandidatesWithProgress?: Map<string, number>;
}

interface UpdateCandidateProps {
    // The candidate to update. If no candidate is provided, creates a new one.
    toUpdate?: Candidate;
    // Set district as this when updating always.
    district: District;
    // When the candidate has been updated successfully, call this
    onUpdateSuccess?: (district: District, message: { jsx: React.ReactNode, plain: string }) => void;
    // When the candidate has been deleted successfully, call this
    onDeleteSuccess?: () => void;
}

// Components

/**
 * Component that lists out the candidates.
 */
export const ListCandidates = (props: ListCandidatesProps) => {
    // State to store candidate if selected
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(null);

    const { loading, error, data } = useQuery(LIST_CANDIDATES, { skip: !!props.candidates });

    // Handle specific cases
    if (loading && !props.candidates) return (<Loading />);
    if (error && !props.candidates) return (<GenericAlert message="There was an error loading candidates. If this error persists, please contact support."
                                                          type={ AlertType.danger } />);
    if ((data && data.candidates.length === 0) || (props.candidates && props.candidates.length === 0))
        return (<GenericAlert message="There are no candidates at the moment." type={ AlertType.info } />);

    const candidates: Array<Candidate | null> = props.candidates ? props.candidates : (data ? data.candidates : null);

    // Event to change candidate
    const handleOnClickCandidate = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        if (props.onClickCandidate) {
            props.onClickCandidate(candidate);
        }
    };

    return (
        <ul className="candidate-list">
            {
                candidates && candidates.map(candidate => (
                    <li key={candidate.id}
                        onClick={ () => handleOnClickCandidate(candidate)}
                        title={ candidate.name + ( props.mapCandidatesWithProgress && props.mapCandidatesWithProgress.has(candidate.id) ? ` (${props.mapCandidatesWithProgress.get(candidate.id)}%)` : "" ) }
                        className={ (props.clickable ? ("clickable " + ((props.selectable && selectedCandidate && selectedCandidate.id === candidate.id) ? "selected" : "")) : "") }>
                        <div className="candidate-party-bar">
                            {
                                props.mapCandidatesWithProgress && props.mapCandidatesWithProgress.has(candidate.id) ? (
                                    <div className="candidate-progress-bar"
                                         style={{
                                             width: `${props.mapCandidatesWithProgress.get(candidate.id)}%`,
                                             backgroundColor: candidate.politicalParty.colour,
                                             borderTopRightRadius: props.mapCandidatesWithProgress.get(candidate.id) === 100 ? '3px' : '0px'
                                         }}>
                                    </div>
                                ) : (
                                    <div className="candidate-progress-bar"
                                         style={{
                                             width: '100%',
                                             backgroundColor: candidate.politicalParty.colour,
                                             borderTopRightRadius: '3px'
                                         }}>
                                    </div>
                                )
                            }
                        </div>
                        <div className="candidate-item--avatar"
                             style={ { backgroundImage: `url(${process.env.REACT_APP_VOTING_SERVICE_BASE_URL}${candidate.picture.location})` } }>
                        </div>
                        <div className="candidate-item--info">
                            <div className="candidate-party"
                                 style={{ color: candidate.politicalParty.colour }}
                                 title={"Political Party Affiliation: " + candidate.politicalParty.name}>
                                { candidate.politicalParty.name }
                            </div>
                            <div className="candidate-name">
                                { candidate.name }
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul>
    );
};

/**
 * Component that updates a candidate from the props. If no candidate is provided, it creates a new one
 * on submit. If there is one provided, there is an option to delete as well.
 */
export const UpdateCandidate = (props: UpdateCandidateProps) => {
    // Set states
    const [name, setName] = useState<string>('');
    const [politicalParty, setPoliticalParty] = useState<PoliticalParty>(null);
    // TODO: Ensure that picture can be uploaded optionally when updating
    const [picture, setPicture] = useState<File>(null);
    const [toUpdate, setToUpdate] = useState<Candidate>(null);

    // Apollo hooks with error states
    const [createCandidate, { loading: loadingCreate, data: dataCreate }] = useMutation<{ createCandidate: Candidate }>(CREATE_CANDIDATE);
    const [errorCreate, setErrorCreate] = useState<ApolloError | null>(null);
    const [updateCandidate, { loading: loadingUpdate, data: dataUpdate }] = useMutation<{ updateCandidate: Candidate }>(UPDATE_CANDIDATE);
    const [errorUpdate, setErrorUpdate] = useState<ApolloError | null>(null);
    const [deleteCandidate, { loading: loadingDelete, data: dataDelete }] = useMutation<{ deleteCandidate: Candidate }>(DELETE_CANDIDATE);
    const [errorDelete, setErrorDelete] = useState<ApolloError | null>(null);
    const { loading: loadingPP, error: errorPP, data: dataPP } = useQuery(LIST_POLITICAL_PARTIES);

    // Set states, update location of picture, and reset error messages whenever props change
    useEffect(() => {
        if (props.toUpdate && props.toUpdate.picture && props.toUpdate.picture.location) {
            // Deep clone hack
            const toUpdateClone = JSON.parse(JSON.stringify(props.toUpdate));
            // Update the location of the picture to full absolute path
            toUpdateClone.picture.location = `${process.env.REACT_APP_VOTING_SERVICE_BASE_URL}${toUpdateClone.picture.location}`;
            setToUpdate(toUpdateClone);
        }

        setName(props.toUpdate && props.toUpdate.name ? props.toUpdate.name : '');
        setPoliticalParty(props.toUpdate && props.toUpdate.politicalParty ? props.toUpdate.politicalParty : null);
        setPicture(null);
        setErrorUpdate(null);
        setErrorCreate(null);
    }, [props.toUpdate]);

    const handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        if (props.toUpdate) {
            updateCandidate({ variables: { id: props.toUpdate.id, name, politicalParty: politicalParty.id, picture, district: props.district.id } })
                .then((data) => {
                    if (props.onUpdateSuccess) {
                        props.onUpdateSuccess(data.updateCandidate as Candidate, {
                            jsx: (<span>The candidate, <strong>{ (data.updateCandidate as Candidate).name}</strong>, has been updated in the election.</span>),
                            plain: `The candidate, ${(data.updateCandidate as Candidate).name}, has been updated in the election.`
                        })
                    }
                }).catch(error => setErrorUpdate(error));
        } else {
            createCandidate({ variables: { name, politicalParty: politicalParty.id, picture, district: props.district.id } })
                .then((data) => {
                    if (props.onUpdateSuccess) {
                        props.onUpdateSuccess(data.updateCandidate as Candidate, {
                            jsx: (<span>The candidate, <strong>{ (data.updateCandidate as Candidate).name}</strong>, has been added to the election.</span>),
                            plain: `The candidate, ${(data.updateCandidate as Candidate).name}, has been added to the election.`
                        })
                    }
                }).catch(error => setErrorCreate(error));
        }
    };

    const handleDelete = (): void => {
        if (props.toUpdate) {
            // Function to update the in-memory cache
            const updateCache = (client) => {
                const data = client.readQuery({ query: LIST_CANDIDATES });
                const newData = { candidates: data.candidates.filter((i) => i.id !== props.toUpdate.id) };
                client.writeQuery({
                    query: LIST_CANDIDATES,
                    data: newData,
                });
            };

            deleteCandidate({ variables: { id: props.toUpdate.id }, update: updateCache })
                .then(() => {
                    if (props.onDeleteSuccess) props.onDeleteSuccess();
                }).catch(error => setErrorDelete(error));
        }
    };

    return (
        <div>
            <ApolloErrorAlert error={ errorCreate ? errorCreate : (errorUpdate ? errorUpdate : (errorDelete ? errorDelete : errorPP)) } />
            <GenericAlert shouldShow={ dataCreate !== undefined || dataUpdate !== undefined }
                          message={ dataCreate ? (
                                <span>The candidate, <strong>{ (dataCreate.createPoliticalPartyCandidate as Candidate).name}</strong>, has been added to the election.</span>
                            ) : (dataUpdate ? (
                                <span>The candidate, <strong>{ (dataUpdate.updatePoliticalPartyCandidate as Candidate).name}</strong>, has been updated in the election.</span>
                                ) : (
                                    dataDelete && <span>The candidate has been deleted in the election.</span>
                                )
                            )
                          }
                          type={ AlertType.success } />
            {
                !dataDelete && (
                    <form onSubmit={ handleSubmit }>
                        <div className="form-group">
                            <label className="required">
                                Full Name of Candidate
                                <input type="text"
                                    className="form-control"
                                    value={ name }
                                    onChange={ event => setName(event.target.value) }
                                    required />
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="required">
                                Political Party
                                {
                                    loadingPP || !dataPP || !dataPP.politicalParties ? <Loading/> : (
                                        <select className="form-control"
                                                value={ politicalParty ? politicalParty.id : null }
                                                onChange={ event => setPoliticalParty(dataPP.politicalParties.find((pp: PoliticalParty) => pp.id === event.target.value)) }>
                                            {
                                                dataPP.politicalParties.map((party: PoliticalParty) => (
                                                    <option key={ party.id }
                                                            value={ party.id }>
                                                        { party.name }
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="required">
                                District
                                <input type="text"
                                    className="input-group"
                                    readOnly
                                    disabled
                                    value={props.district.name} />
                            </label>
                        </div>
                        <FilePicker label="Picture of Candidate"
                                    required
                                    presetFile={ toUpdate ? toUpdate.picture : null }
                                    accept="image/jpg,image/png,image/jpeg,image/gif"
                                    onFileSelected={(file: File) => setPicture(file)} />
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
