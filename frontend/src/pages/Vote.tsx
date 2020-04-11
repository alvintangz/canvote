import React, { useState } from 'react';
import { User } from "../interfaces/models/user";
import {connect} from "react-redux";
import gql from 'graphql-tag';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { ListCandidates } from "../components/PPCandidate"
import {Candidate} from "../interfaces/models";
import {Link} from "react-router-dom";

const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

interface Props {
    currentUser: User;
}

const CANVOTE = gql`
    query canVote {
        canVote {
            flag
            info
        }
    }
`;

const CREATE_VOTE = gql`
    mutation vote($candidate: ID!) {
        vote(candidate: $candidate)
    }
`;

const GET_CANDIDATES = gql`
    query meAsVoter {
        meAsVoter {
        authId
        district {
            id
            name
            candidates {
            id
            name
            politicalParty {
                id
                name
            }
            picture {
                filename
                location
                mimetype
            }
            }
        }
        }
    }

`

function Vote(props: Props) {


    const [candidateChosen, setCandidateChosen] = useState<Candidate>(null);
    const [votedPartOne, setVotedPartOne] = useState(false);
    const [votedPartTwo, setVotedPartTwo] = useState(false);


    const { data } = useQuery(CANVOTE, { errorPolicy: 'all', fetchPolicy: 'no-cache'})
    const candidResult = useQuery(GET_CANDIDATES, { errorPolicy: 'all', fetchPolicy: 'no-cache'})

    const [addVote] = useMutation(CREATE_VOTE, {errorPolicy: 'all'});
  
    if (data) {
        console.log(data)
    }
 
    if (candidResult.data) {
        console.log(candidResult)
    }

    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        addVote({ variables: { candidate: candidateChosen.id } })
            .then((res) => {
                setVotedPartTwo(true)
            })
            .catch((err) => console.log(err))

    }


    return (
        <div>
            <h1>Choose your candidate</h1>
            {
                data ?
                    data.canVote.flag === true ?
                        candidResult.data && !votedPartTwo ?
                            <div>
                                You are currently registered to vote in <strong>{candidResult.data.meAsVoter.district.name}</strong>.<br/>
                                Please select a candidate that you would like to vote for in this election.
                            </div>
                        : null
                    : null
                : null
            }

            {
                votedPartTwo ? 
                <div className="alert alert-success">
                    <h2>Thanks for voting </h2>
                    <Link to="/">Back</Link>                       
                </div>
                
            
            :
                data ?
                    data.canVote.flag === true ? 
                        candidResult.data ?  
                            <div className="voting-container">
                                <ListCandidates selectable clickable onClickCandidate={(e) => setCandidateChosen(e)} candidates={candidResult.data.meAsVoter.district.candidates}/>
                                <br/>
                                <p> Selected Candidate: <strong>{ candidateChosen ? candidateChosen.name : 'None' }</strong> </p>
                                {
                                    !votedPartOne ? <button type="submit" className="btn btn-primary" onClick={() => candidateChosen && setVotedPartOne(true)}> Vote </button>
                                    : null

                                }
                                {
                                    votedPartOne ?
                                        <div>
                                            <p> Are you sure ? </p>
                                            <button type="submit" className="btn btn-success col-sm-2" onClick={handleSubmit}>Yes</button>
                                            <button type="submit" className="btn btn-danger col-sm-2 ml-1" onClick={() => setVotedPartOne(false)}>No</button>
                                        </div>

                                    : null
                                }

                            </div>
                            : null

                    : <div className="alert alert-danger">
                        <h2> You cannot vote </h2>
                        <p>{data.canVote.info}</p>    
                        <Link to="/">Back</Link>                    
                      </div>


                : <p> Loading... </p>
            }
        


        </div>
    );
}

export default connect(mapStateToProps)(Vote);
