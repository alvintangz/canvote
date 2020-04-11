import React from 'react';
import { DisplayDistricts } from '../components/District';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit, faList, faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Candidate, District, PoliticalParty} from '../interfaces/models';
import { UpdateDistrict, ListDistricts } from '../components/District';
import {ListCandidates, UpdateCandidate} from "../components/PPCandidate";
import {AlertType} from "../enums/alert-type";
import {GenericAlert} from "../components/shared/Alert";
import Modal from 'react-modal';
import {ListPoliticalParties, UpdatePoliticalParty} from "../components/PoliticalParty";

Modal.setAppElement('#root');

// GraphQL Queries

interface State {
    // Whether or not to list the districts on the side
    listingDistricts: boolean;
    // If null, !listingDistrict and !!updateCurrentDistrict, creating a new district
    currentDistrict: District | null;
    // Whether or not to update current district stored in currentDistrict state
    updateCurrentDistrict: boolean;
    // Is the modal to update a candidate open?
    updateCandidateModalIsOpen: boolean;
    // The candidate to update in the modal if open. If null, create a new candidate
    candidateToUpdateInModal: Candidate | null;
    // Manage political parties modal
    politicalPartiesModalIsOpen: boolean;
    // If null, !politicalPartiesModalIsOpen and !!updateCurrentPoliticalParty, creating a new district
    currentPoliticalParty: PoliticalParty | null;
    // Whether or not to update current political party stored in currentPoliticalParty state
    updateCurrentPoliticalParty: boolean;
    // On success of after update current political party
    afterUpdateCurrentPoliticalPartySuccess: React.ReactNode | null;
    // Whether or not any of these deletion actions have occured:
    hasCandidateBeenDeleted: boolean;
    hasDistrictBeenDeleted: boolean;
    hasPoliticalPartyBeenDeleted: boolean;
}


// Could be a functional component instead :)
export default class Election extends React.Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            listingDistricts: true,
            currentDistrict: null,
            updateCurrentDistrict: false,
            updateCandidateModalIsOpen: false,
            candidateToUpdateInModal: null,
            politicalPartiesModalIsOpen: false,
            currentPoliticalParty: null,
            updateCurrentPoliticalParty: false,
            afterUpdateCurrentPoliticalPartySuccess: null,
            hasCandidateBeenDeleted: false,
            hasDistrictBeenDeleted: false,
            hasPoliticalPartyBeenDeleted: false
        };
    }

    render() {
        const handleActionToListDistricts = () => {
            this.setState({
                currentDistrict: null,
                listingDistricts: true,
                updateCurrentDistrict: false,
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToViewDistrict = (district: District) => {
            this.setState({
                currentDistrict: {...district},
                listingDistricts: false,
                updateCurrentDistrict: false,
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToCreateDistrict = () => {
            this.setState({
                currentDistrict: null,
                listingDistricts: false,
                updateCurrentDistrict: true,
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleBtnClickToEditDistrict = (district: District) => {
            this.setState({
                currentDistrict: {...district},
                listingDistricts: false,
                updateCurrentDistrict: true,
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToCreateCandidate = () => {
            this.setState({
                updateCandidateModalIsOpen: true,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToUpdateCandidate = (candidate: Candidate) => {
            this.setState({
                updateCandidateModalIsOpen: true,
                candidateToUpdateInModal: candidate,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToCloseCandidateUpdateModal = () => {
            this.setState({
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToListPoliticalPartiesInModal = () => {
            this.setState({
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: true,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToEditPoliticalParty = (party?: PoliticalParty) => {
            this.setState({
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: true,
                currentPoliticalParty: party,
                updateCurrentPoliticalParty: true,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleActionToClosePoliticalPartyModal = () => {
            this.setState({
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: null
            });
        };

        const handleAfterUpdatePoliticalPartySuccess = (party: PoliticalParty, message: { jsx: React.ReactNode, plain: string }) => {
            this.setState({
                updateCandidateModalIsOpen: false,
                candidateToUpdateInModal: null,
                politicalPartiesModalIsOpen: false,
                currentPoliticalParty: null,
                updateCurrentPoliticalParty: false,
                afterUpdateCurrentPoliticalPartySuccess: message.jsx
            });
        };

        const handleCandidateDeleted = () => {
            handleActionToCloseCandidateUpdateModal();

            this.setState({
                hasCandidateBeenDeleted: true,
                hasDistrictBeenDeleted: false,
                hasPoliticalPartyBeenDeleted: false
            });

            handleActionToListDistricts();
        };

        const handleDistrictDeleted = () => {
            this.setState({
                hasCandidateBeenDeleted: false,
                hasDistrictBeenDeleted: true,
                hasPoliticalPartyBeenDeleted: false
            });

            handleActionToListDistricts();
        };

        const handlePoliticalPartyDeleted = () => {
            handleActionToClosePoliticalPartyModal();

            this.setState({
                hasCandidateBeenDeleted: false,
                hasDistrictBeenDeleted: false,
                hasPoliticalPartyBeenDeleted: true
            });

            handleActionToListDistricts();
        };

        const handleClearAnyDeletionMessage = () => {
            this.setState({
                hasCandidateBeenDeleted: false,
                hasDistrictBeenDeleted: false,
                hasPoliticalPartyBeenDeleted: false
            });
        };

        return (
            <div>
                <h1>Election Admin</h1>
                {
                    (this.state.hasDistrictBeenDeleted || this.state.hasCandidateBeenDeleted || this.state.hasPoliticalPartyBeenDeleted) && (
                        <GenericAlert type={ AlertType.success } 
                                      message={ 
                                        <div>
                                            The { this.state.hasDistrictBeenDeleted ? "district" : (this.state.hasCandidateBeenDeleted ? "candidate" : "political party") } has been successfully deleted. <a href="#" onClick={ handleClearAnyDeletionMessage }>Dismiss.</a>
                                        </div>
                                        } />
                    )
                }
                <div className="row">

                    <div className="col-md-8 col-xl-9 mb-2">
                        <DisplayDistricts onClickDistrict={ handleBtnClickToEditDistrict } />
                    </div>

                    <div className="col-md-4 col-xl-3">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="btn-group">
                                    <button className="btn btn-success btn-sm"
                                            onClick={ handleActionToCreateDistrict }
                                            title="Create a new district">
                                        <FontAwesomeIcon icon={ faPlus } className="fa-left" />District
                                    </button>
                                    {
                                        !this.state.listingDistricts && (
                                            <button className="btn btn-primary btn-sm"
                                                    onClick={ handleActionToListDistricts }
                                                    title="List out all the districts">
                                                <FontAwesomeIcon icon={ faList } className="fa-left" />Districts
                                            </button>
                                        )
                                    }
                                    <button className="btn btn-default btn-sm"
                                            onClick={ handleActionToListPoliticalPartiesInModal }
                                            title="Manage Political Parties">
                                        <FontAwesomeIcon icon={ faEdit } className="fa-left" />Parties
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h2 className="h3 panel-title">
                                    {
                                        this.state.listingDistricts ?
                                            "Districts" :
                                            (this.state.currentDistrict && this.state.currentDistrict.name ?
                                                this.state.currentDistrict.name : "New District")
                                    }
                                </h2>
                            </div>
                            <div className="panel-body">
                            {
                                this.state.listingDistricts ?
                                    <ListDistricts onClickDistrict={ handleActionToViewDistrict } /> :
                                    this.state.updateCurrentDistrict ?
                                        <UpdateDistrict toUpdate={ this.state.currentDistrict } onDeleteSuccess={ handleDistrictDeleted } /> :
                                        (
                                            <div>
                                                <div className="btn-group">
                                                    <button className="btn btn-default btn-sm"
                                                            onClick={() => handleBtnClickToEditDistrict(this.state.currentDistrict)}>
                                                        <FontAwesomeIcon icon={ faEdit } className="fa-left" />Edit
                                                    </button>
                                                </div>
                                                <hr />
                                                <div className="clearfix">
                                                    <h3 className="h4 pull-left">Candidates in District</h3>
                                                    <button className="btn btn-sm pull-right"
                                                            onClick={ handleActionToCreateCandidate }
                                                            title="Create candidate">
                                                        <FontAwesomeIcon icon={ faPlus } className="fa-left" />Candidate
                                                    </button>
                                                </div>
                                                {
                                                    this.state.currentDistrict.candidates.length > 0 ?
                                                        <ListCandidates district={ this.state.currentDistrict }
                                                                        clickable={ true } 
                                                                        onClickCandidate={ handleActionToUpdateCandidate } /> :
                                                        <GenericAlert message="Currently, there are no candidates for this district." type={ AlertType.info } />
                                                }
                                            </div>
                                        )
                            }
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={ this.state.updateCandidateModalIsOpen }
                       className="rmodal-content rmodal-md"
                       contentLabel="Update candidate modal">
                    <div className="rmodal-header">
                        <h2 className="rmodal-header-title">{ !this.state.candidateToUpdateInModal ? "Create" : "Update" } Candidate</h2>
                        <button className="btn btn-danger btn-sm ml-1"
                                onClick={ handleActionToCloseCandidateUpdateModal }
                                title="Close Modal">
                            <FontAwesomeIcon icon={ faTimes } className="fa-left" />Close
                        </button>
                    </div>
                    <div className="rmodal-body">
                        <UpdateCandidate district={ this.state.currentDistrict } 
                                         onDeleteSuccess={ handleCandidateDeleted }
                                         onCreateSuccess={ () => { this.setState({ listingDistricts: true }) } }
                                         toUpdate={ this.state.candidateToUpdateInModal } />
                    </div>
                </Modal>

                <Modal isOpen={ this.state.politicalPartiesModalIsOpen }
                       className="rmodal-content rmodal-md"
                       contentLabel="Political parties modal">
                    <div className="rmodal-header">
                        <h2 className="rmodal-header-title">Political Parties</h2>
                        <button className="btn btn-danger btn-sm ml-1"
                                onClick={ handleActionToClosePoliticalPartyModal }
                                title="Close Modal">
                            <FontAwesomeIcon icon={ faTimes } className="fa-left" />Close
                        </button>
                    </div>
                    {
                        this.state.updateCurrentPoliticalParty ? (
                            <div className="rmodal-body">
                                <div className="header-flex">
                                    <h3>{ this.state.currentPoliticalParty ? "Update" : "Create" } Political Party</h3>
                                    <button className="btn btn-sm btn-default"
                                            title="List all political parties" 
                                            onClick={ handleActionToListPoliticalPartiesInModal }>
                                        <FontAwesomeIcon icon={ faList } className="fa-left" />Party
                                    </button>
                                </div>
                                <hr />
                                <UpdatePoliticalParty toUpdate={ this.state.currentPoliticalParty }
                                                      onDeleteSuccess={ handlePoliticalPartyDeleted }
                                                      onUpdateSuccess={ handleAfterUpdatePoliticalPartySuccess } />
                            </div>
                        ) : (
                            <div className="rmodal-body">
                                <div className="header-flex">
                                    <h3>All Political Parties</h3>
                                    <button className="btn btn-sm btn-success"
                                            title="Create a new political party" 
                                            onClick={() => handleActionToEditPoliticalParty()}>
                                        <FontAwesomeIcon icon={ faPlus } className="fa-left" />Party
                                    </button>
                                </div>
                                <hr />
                                {
                                    this.state.afterUpdateCurrentPoliticalPartySuccess && <GenericAlert message={ this.state.afterUpdateCurrentPoliticalPartySuccess } 
                                                                                                        type={ AlertType.success } />
                                }
                                <ListPoliticalParties clickable={ true } 
                                                      onClickPoliticalParty={ handleActionToEditPoliticalParty } />
                            </div>
                        )
                    }
                </Modal>

            </div>
        );
    }
}
