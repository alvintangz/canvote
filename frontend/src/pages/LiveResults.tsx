import React from "react";
import BroadcastData, { BroadcastDataDistrict, BroadcastDataParty } from '../interfaces/responses/broadcast-data';
import BroadcastError from '../interfaces/responses/broadcast-error';
import { DisplayDistricts, ListDistricts } from '../components/District';
import { ListPoliticalParties } from "../components/PoliticalParty";
import { GenericAlert } from "../components/shared";
import { AlertType } from "../enums/alert-type";
import { District, Candidate, PoliticalParty } from "../interfaces/models";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { ListCandidates } from "../components/PPCandidate";
import Moment from 'react-moment';
import ChartistGraph from 'react-chartist';
Modal.setAppElement('#root');

enum DisplayResultState {
    PARTIES_LISTED,
    MAP_DISTRICTS,
    PROJECT_SEATS_CHART,
    PARTY_POPULARITY_CHART,
}

interface State {
    // Data from broadcast; should update everytime a message comes through
    broadcastedData: BroadcastData | null;
    // Current error passed in from server (if any from latest broadcast)
    currentServerErrorFromBroadcast: string | null;
    // Current state of the results to display
    displayState: DisplayResultState;
    // Selected district in modal for map districts (if null, modal is closed)
    selectedDistrict: District | null;
    // List of all political parties
    allParties: PoliticalParty[] | null;
    // True if ws closed
    broadcastWsClosed: boolean;
    // True if ws error out
    broadcastWsError: boolean;
    // True if ws is open
    broadcastWsOpen: boolean;
}

export default class LiveResults extends React.Component<{}, State> {
    private websocket: WebSocket;

    constructor(props) {
        super(props);
        this.state = { 
            broadcastedData: null,
            currentServerErrorFromBroadcast: null,
            displayState: DisplayResultState.PARTIES_LISTED,
            selectedDistrict: null,
            allParties: null,
            broadcastWsClosed: false,
            broadcastWsError: false,
            broadcastWsOpen: false,
        };
    }

    componentDidMount() {
        this.connectToBroadcast();
    }

    componentWillUnmount() {
        this.disconnectToBroadcast();
    }

    private setInitalState = (): void => {
        this.setState({
            broadcastedData: null,
            currentServerErrorFromBroadcast: null,
            displayState: DisplayResultState.PARTIES_LISTED,
            selectedDistrict: null,
            allParties: null,
            broadcastWsClosed: false,
            broadcastWsError: false,
            broadcastWsOpen: false,
        });
    };

    private connectToBroadcast = (): void => {
        if (!this.state.broadcastWsOpen) {
            this.websocket = new WebSocket(process.env.REACT_APP_WS_SERVICE_WS_URL);
            
            this.websocket.onmessage = (message: MessageEvent) => {
                const payload = JSON.parse(message.data);
    
                if (!('error' in payload)) {
                    this.setState({ 
                        broadcastedData: payload as BroadcastData,
                        currentServerErrorFromBroadcast: null,
                        broadcastWsError: false,
                    });
                } else {
                    // Still want to keep past broadcast data
                    this.setState({ currentServerErrorFromBroadcast: (payload as BroadcastError).error });
                }
            };
    
            this.websocket.onopen = () => {
                this.setState({ broadcastWsOpen: true, broadcastWsClosed: false });
            }
            
            this.websocket.onerror = () => {
                this.setState({ broadcastWsError: true });
            };
    
            this.websocket.onclose = () => {
                this.setState({ broadcastWsClosed: true, broadcastWsOpen: false });
            }
        }
    }

    private disconnectToBroadcast = (): void => {
        if (this.websocket && this.state.broadcastWsOpen) {
            this.websocket.close();
            this.setInitalState();
        }
    }

    private retrieveBroadcastedDataDistrict = (district: District): BroadcastDataDistrict  => {
        if (!this.state.broadcastedData) return undefined;
        return this.state.broadcastedData.districts.find((dis) => dis.id === district.id);
    };

    private retrieveCandidateWithPopularVoteInDistrict = (district: District): Candidate => {
        if (!this.state.broadcastedData) return undefined;
        const leadingPartyInDistrict = this.retrieveBroadcastedDataDistrict(district).leadingPartyInDistrict;
        return district.candidates.find((candidate: Candidate) => candidate.politicalParty.id === leadingPartyInDistrict);
    }

    private handleRetrieveAllParties = (parties: PoliticalParty[]): void => {
        this.setState({ allParties: parties });
    }

    get mapPoliticalPartyWithStatistics(): Map<string, {totalVoteCount: number, projectedSeats: number }> {
        const map = new Map<string, {totalVoteCount: number, projectedSeats: number }>();

        if (this.state.broadcastedData && this.state.broadcastedData.parties) {
            this.state.broadcastedData.parties.forEach(({ id, voteCount, projectedNumberOfSeats }) => 
                map.set(id, { totalVoteCount: voteCount, projectedSeats: projectedNumberOfSeats })
            );
        }

        return map;
    };

    get mapCandidatesWithProgressForSelectedDistrict(): Map<string, number> {
        const map = new Map<string, number>();

        if (this.state.broadcastedData && this.state.selectedDistrict) {
            const broadcastedDistrict = this.retrieveBroadcastedDataDistrict(this.state.selectedDistrict);
            if (broadcastedDistrict) {
                broadcastedDistrict.candidates.forEach(({ id, votePercentageWithinDistrict }) => map.set(id, votePercentageWithinDistrict));
            }
        }

        return map;
    };

    get mapDistrictsWithColours(): Map<string, string> {
        const map = new Map<string, string>();

        if (this.state.broadcastedData && this.state.broadcastedData.districts) {
            this.state.broadcastedData.districts.forEach((broadcastedDistrict) => {
                console.log(broadcastedDistrict.leadingPartyInDistrict);
                // If there's more than one leading party
                if (Array.isArray(broadcastedDistrict.leadingPartyInDistrict) && this.state.allParties) {
                    // Loop through all parties to get the correct colour to map
                    this.state.allParties.forEach((party) => {
                        // Just choose the first one
                        if (party.id === broadcastedDistrict.leadingPartyInDistrict[0]) {
                            map.set(broadcastedDistrict.id, party.colour);
                        }
                    });
                } else if (typeof broadcastedDistrict.leadingPartyInDistrict === "string" && this.state.allParties) {
                    // Loop through all parties to get the correct colour to map
                    this.state.allParties.forEach((party) => {
                        if (party.id === broadcastedDistrict.leadingPartyInDistrict) {
                            map.set(broadcastedDistrict.id, party.colour);
                        }
                    });
                } else {
                    map.set(broadcastedDistrict.id, '#000');
                }
            });
        }

        return map;
    }

    private constructBar = (field) => {        
        const parties: BroadcastDataParty[] = this.state.broadcastedData.parties;
                    
        const data = {
            labels: parties.map(p => p.name),
            series: [parties.map(p => ({ value: { y: p[field] }, meta: { politicalParty: p } }))]
        };

        const options = {
            width: '100%',
            height: 400,
            showGrid: true,
            low: 0,
            axisY: {
                onlyInteger: true,
                showGrid: true,
        
                referenceValue: Math.max.apply(0, parties.map(p => p[field])) + 1,
            },
            axisX: {
                labelOffset: {
                    x: 5,
                    y: 5
                  },
            },
        };

        const listener = {
            draw: (context) => {
                if (context.type === 'bar') {
                    const colorForParty = this.state.allParties.find(p => p.id === context.meta.politicalParty.id).colour;
                    context.element.attr({
                        style: `stroke: ${colorForParty}; stroke-width: 30px;`,
                    });
                }
                if(context.type === 'grid' && context.index !== 0) {
                    context.element.remove();
                }
            }
        };

        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <ChartistGraph listener={ listener } data={data} type={'Bar'} options={options} />
                </div>
            </div>
        )        
    }

    render() {
        // Based off the state to display, select which react node to display
        let toDisplay: React.ReactNode;
        switch(this.state.displayState) {
            case DisplayResultState.MAP_DISTRICTS:
                toDisplay = (
                    <div className="panel panel-default m-0">
                        <DisplayDistricts mapDistrictsWithColours={ this.mapDistrictsWithColours } 
                                          onClickDistrict={ (district: District) => this.setState({ selectedDistrict: district }) } />
                        <div className="panel-body">
                            <ListDistricts districts={this.state.broadcastedData ? this.state.broadcastedData.districts : null}
                             onClickDistrict={ (district: District) => this.setState({ selectedDistrict: district }) } />
                        </div>
                    </div>
                );
                break;
            case DisplayResultState.PROJECT_SEATS_CHART:
                if (this.state.broadcastedData && this.state.allParties) {
                    toDisplay = this.constructBar('projectedNumberOfSeats')
                } else {
                    toDisplay = (<p>Loading...</p>);
                }
                break;
            case DisplayResultState.PARTY_POPULARITY_CHART:
                if (this.state.broadcastedData && this.state.allParties) {
                   toDisplay = this.constructBar('voteCount')
                } else {
                    toDisplay = (<p>Loading...</p>);
                }
                break;
            case DisplayResultState.PARTIES_LISTED:
            default:
                toDisplay = (
                    <ListPoliticalParties mapPoliticalPartyWithStatistics={ this.mapPoliticalPartyWithStatistics }
                                          onRetrieveAllParties={ this.handleRetrieveAllParties } />
                );
        }

        const calendarStrings = {
            lastDay : '[yesterday at] LT',
            sameDay : '[today at] LT',
        };
        

        return (
            <div>
                <h1>Live Election Results</h1>
                {
                    this.state.broadcastWsClosed && (
                        <GenericAlert title="Connection Closed"
                                      type={ AlertType.warning } 
                                      message={ 
                                        <div>
                                            <p className="m-0">
                                                The connection to retrieve live election results was closed. { 
                                                    this.state.broadcastedData && (
                                                        <span>The results were last retrieved <Moment format="LLLL">{ this.state.broadcastedData.lastUpdated }</Moment>. </span>
                                                    ) 
                                                }
                                                This may have happened automatically due to inactivity.<br/>
                                                To try connect again, <a className="btn btn-link btn-link-reg" onClick={ this.connectToBroadcast }>click this</a>.
                                            </p>
                                        </div>
                                      } />
                    )
                }
                {
                    this.state.broadcastWsError && (
                        <GenericAlert title="Connection Error"
                                      type={ AlertType.danger } 
                                      message={ 
                                        <div>
                                            <p className="m-0">
                                                There was an error with your connection to retrieve live election results. This may disappear if the next retrieval of results becomes successful. If this continues please contact support.
                                            </p>
                                        </div>
                                      } />
                    )
                }
                {
                    this.state.currentServerErrorFromBroadcast && 
                        <GenericAlert title="Error refreshing data"
                                      type={ AlertType.danger } 
                                      message={ 
                                        <div>
                                            <p className="m-0">There was an error fetching the latest election results. If this continues please contact support.</p>
                                            <small><strong>More information:</strong> { this.state.currentServerErrorFromBroadcast }</small>
                                        </div>
                                      } />
                }

                <div className="row">
                    <div className="col-md-3 col-xl-2 col-md-push-9">
                        <div className="list-group">
                            <button className={ "list-group-item" + (this.state.displayState === DisplayResultState.PARTIES_LISTED ? " active" : "") } 
                                    onClick={ () => this.setState({ displayState: DisplayResultState.PARTIES_LISTED }) }>
                                <h4 className="list-group-item-heading">Listed: Political Parties</h4>
                                <p className="list-group-item-text">View all political parties and their projected seats</p>
                            </button>
                            <button className={ "list-group-item" + (this.state.displayState === DisplayResultState.PROJECT_SEATS_CHART ? " active" : "") } 
                                    onClick={ () => this.setState({ displayState: DisplayResultState.PROJECT_SEATS_CHART }) }>
                                <h4 className="list-group-item-heading">Chart: Projected Seats</h4>
                                <p className="list-group-item-text">Quickly compare projected seats in parliament based off current data</p>
                            </button>
                            <button className={ "list-group-item" + (this.state.displayState === DisplayResultState.PARTY_POPULARITY_CHART ? " active" : "") } 
                                    onClick={ () => this.setState({ displayState: DisplayResultState.PARTY_POPULARITY_CHART }) }>
                                <h4 className="list-group-item-heading">Chart: Popularity of Parties</h4>
                                <p className="list-group-item-text">Quickly compare popular votes amongst political parties</p>
                            </button>
                            <button className={ "list-group-item" + (this.state.displayState === DisplayResultState.MAP_DISTRICTS ? " active" : "") } 
                                    onClick={ () => this.setState({ displayState: DisplayResultState.MAP_DISTRICTS }) }>
                                <h4 className="list-group-item-heading">Map and List: Districts</h4>
                                <p className="list-group-item-text">Compare election results within a district selected from a map or a list</p>
                            </button>
                        </div>
                        {
                            this.state.broadcastedData && (
                                <div id="connectionStatus" className="mb-2">
                                    <div className="connect-status">
                                        <div className={ "connect-status-indicator" + (!this.state.broadcastWsError ? (this.state.broadcastWsClosed ? " closed" : "") : " error") }></div>
                                        { (this.state.broadcastWsOpen ? (this.state.broadcastWsError ? "Connected with errors" : "Connected") : "Connection Closed") }
                                    </div>
                                    Results last updated <Moment calendar={calendarStrings}>{ this.state.broadcastedData.lastUpdated }</Moment>
                                </div>
                            )
                        }
                    </div>
                    <div className="col-md-9 col-xl-10 mb-2 col-md-pull-3">
                        { toDisplay }
                    </div>
                </div>

                <Modal isOpen={ !!this.state.selectedDistrict }
                       className="rmodal-content rmodal-md"
                       contentLabel="Chosen district modal">

                    <div className="rmodal-header">
                        <h2 className="rmodal-header-title">District: { this.state.selectedDistrict && this.state.selectedDistrict.name }</h2>
                        <button className="btn btn-danger btn-sm ml-1"
                                onClick={ () => this.setState({ selectedDistrict: null }) }
                                title="Close Modal">
                            <FontAwesomeIcon icon={ faTimes } className="fa-left" />Close
                        </button>
                    </div>

                    <div className="rmodal-body">
                        {
                            this.state.selectedDistrict && this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict) && (
                                <div>
                                    <div className="pp-item" 
                                         title={ this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).name }
                                         style={ { borderColor: this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.colour } }>
                                        <div className="pp-item--heading" style={ { borderBottomColor: this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.colour } }>
                                            <h3 className="mb-0">
                                                Party Leading in District
                                            </h3>
                                        </div>
                                        <div className="pp-item--logo pp-item--logo-sm">
                                            <img src={ process.env.REACT_APP_VOTING_SERVICE_BASE_URL + this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.logo.location }
                                                 alt={ this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.name } />
                                        </div>
                                        <div className="pp-item--info"
                                             style={ { borderTopColor: this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.colour } }>
                                            <span className="m-0 h4" style={ { color: this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.colour } }>
                                                { this.retrieveCandidateWithPopularVoteInDistrict(this.state.selectedDistrict).politicalParty.name }
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            )
                        }
                        <ListCandidates district={ this.state.selectedDistrict } 
                                        mapCandidatesWithProgress={ this.mapCandidatesWithProgressForSelectedDistrict } />
                    </div>
                    
                </Modal>
            </div>
        );
    }
}
