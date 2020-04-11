import React, {Component} from 'react';
import {Link} from "react-router-dom";
import users from '../api/users';
import {UserRole} from '../enums/role';
import {User} from "../interfaces/models/user";
import {connect} from "react-redux";
import client from "../api/apolloClient";
import gql from 'graphql-tag';
import { District } from "../interfaces/models/";

const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

const GET_DISTRICTS = gql`
    query {
        districts {
            id
            name
        }
    }
`;

const UPDATE_VOTER = gql`
    mutation updateVoter($authId: String!, $district: String!) {
        updateVoter(authId: $authId, district: $district) {
            authId
            district {
                id
                name
            }
        }
    }
`;


interface Props {
    currentUser: User
}

interface State {
    currentUser: User,
    userId: number,
    created: User,
    error: string,
    isActive: boolean,
    role: UserRole.voter | UserRole.election_officer,
    districtChosen: {
        id: string,
        name: string
    },
    districts: District[]
}


export class UserUpdate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentUser: { email: '', firstName: '', lastName: ''},
            userId: -1, 
            isActive: false, 
            role: UserRole.election_officer,
            created: null,
            error: null,
            districts: [],
            districtChosen: { id: '', name: '' }
        }
    }

    componentDidMount() {

        this.setState({userId: this.props.match.params.userId}, () => {
            users.retrieveByRole(this.props.currentUser.role === UserRole.administrator? UserRole.election_officer : UserRole.voter
                , this.state.userId)
            .then((e) => {
                // let data = {
                //     email: e.data.email,
                //     firstName: e.data.firstName,
                //     lastName: e.data.lastName,
                //     isActive: e.data.isActive,
                //     role: e.data.role === 'election_officer' ? UserRole.election_officer : UserRole.voter
                // }
                if (this.props.currentUser.role === UserRole.election_officer) {
                    client.query({
                        query: GET_DISTRICTS,
                    }).then(data => {
                        this.setState({
                            districts: data.data.districts
                        });
                    }).catch(error => console.error(error))
                }
                this.setState({
                    currentUser: e.data
                })
            })
            .catch((e) => console.log(e.data))
        });


    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let clone = this.state.currentUser
        clone.email = event.currentTarget.value
        this.setState({ currentUser: clone });
    }

    handleFirstNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let clone = this.state.currentUser
        clone.firstName = event.currentTarget.value
        this.setState({ currentUser: clone });
    }

    handleLastNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let clone = this.state.currentUser
        clone.lastName = event.currentTarget.value
        this.setState({ currentUser: clone });
    }

    handleCheckChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ isActive: !event.target.checked });
    }

    handleDistrictChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let obj = this.state.districts.find((d: District) => d.id === event.target.value);
        this.setState({ districtChosen: obj })
    };

    handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();

        users.updateByRole(this.state.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter, this.state.userId, this.state.currentUser)
            .then((res) => {
                // if we created an election officer, then there is no voting service here, so update state and leave
                if (this.props.currentUser.role === UserRole.administrator) {
                    this.setState({ created: res.data })
                    return
                }
             
                client.mutate({
                    variables: { authId: `${res.data.id}`,  district: this.state.districtChosen.id ? this.state.districtChosen.id : this.state.districts[0].id },
                    mutation: UPDATE_VOTER
                }).then(() => {
                    this.setState({ created: res.data });
                });
            })
            .catch((err) => {
                this.setState({ created: null, error: err.response.data.detail })
                console.log(err)
            })
    }

    render() {
        const roleForCreation = this.state.role === UserRole.election_officer ? 'Voter' : 'Election Officer';

        return (
            <div>
                <h1>Update User</h1>
                {
                    this.state.created && (
                        <div className="alert alert-success">
                            <h2>User Account Updated</h2>
                            <p>The user account for {this.state.created.firstName} {this.state.created.lastName} has been updated.</p>
                            <Link to="/manage/users">Back</Link>
                        </div>
                    )
                }

                {
                    this.state.error && (
                        <div className="alert alert-danger">
                            <h2>User Account Error</h2>
                            <p>{this.state.error}</p>
                        </div>
                    )
                }
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            E-mail address:
                            <input type="email" className="form-control"
                            placeholder="E-mail address" value={this.state.currentUser.email} onChange={this.handleEmailChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            First Name:
                            <input type="text" className="form-control"
                            placeholder="First Name" value={this.state.currentUser.firstName} onChange={this.handleFirstNameChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Last Name:
                            <input type="text" className="form-control"
                            placeholder="Last Name" value={this.state.currentUser.lastName} onChange={this.handleLastNameChange} required/>
                        </label>
                    </div>

                    {
                        roleForCreation === 'Voter' ?

                        <div className="form-group">
                            <label className="required">
                              District
                              <select className="form-control"
                                    value={this.state.districtChosen ? this.state.districtChosen.id : null}
                                    onChange={this.handleDistrictChange}>
                                    {
                                    this.state.districts.map(district => (
                                        <option key={district.id}
                                                value={district.id}>
                                            { district.name }
                                        </option>
                                    ))
                                    }
                              </select>
                            </label>
                        </div>
                        : null
                    }

                    <div className="form-group bg-warning">
                        <label>
                            <input type="checkbox" checked={ !this.state.isActive } style={{marginRight: '5px'}} onChange={this.handleCheckChange} />
                            Deactivate User
                        </label>
                    </div>
                    <input type="submit" className="btn btn-success" value="Submit" />
                    <Link to={`/manage/users/`}>
                        <button className="btn btn-default">Cancel</button>
                    </Link>
                </form>
            </div>
        );
    }
}



export default connect(mapStateToProps)(UserUpdate);
