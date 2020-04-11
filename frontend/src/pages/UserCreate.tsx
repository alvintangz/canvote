import React, {Component} from 'react';
import users from '../api/users';
import {UserRole} from '../enums/role';
import {User} from "../interfaces/models/user";
import {connect} from "react-redux";
import gql from 'graphql-tag';
import client from "../api/apolloClient";
import { Link } from 'react-router-dom';
import { District } from "../interfaces/models/";


const mapStateToProps = (state) => {
    return ({currentUser: state.authReducer.user});
};

interface Props {
    currentUser: User
}

interface State {
    currentUser: User,
    created: User,
    error: string,
    loaded: boolean,
    districtChosen: {
        id: string,
        name: string
    },
    districts: District[]
}

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


export class UserCreate extends Component<Props, State> {
    private roleForCreation;

    constructor(props: Props) {
        super(props);

        this.roleForCreation = this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter;
        this.state = {
            currentUser: { email: '', firstName: '', lastName: ''},
            loaded: false,
            created: null,
            error: null,
            districts: [],
            districtChosen: { id: '', name: '' }
        };
    }

    componentDidMount() {
        client.query({
            query: GET_DISTRICTS,
        }).then(data => {
            this.setState({
                districts: data.data.districts
            });
        }).catch(error => console.error(error))
            .finally(() => {
                this.setState({ loaded: true });
            });
    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let clone = this.state.currentUser
        clone.email = event.currentTarget.value
        this.setState({ currentUser: clone });

    };

    handleFirstNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let clone = this.state.currentUser
        clone.firstName = event.currentTarget.value
        this.setState({ currentUser: clone });    
    };

    handleLastNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let clone = this.state.currentUser
        clone.lastName = event.currentTarget.value
        this.setState({ currentUser: clone });
    };

    handleDistrictChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let id = event.currentTarget.value;
        let obj = this.state.districts.find((d: District) => d.id === event.target.value);
        this.setState({ districtChosen: obj }, () => console.log(this.state.districtChosen) )
    };

    handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        users.createByRole( 
            this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter,
            this.state.currentUser).then((res) => {
                // res.data
                // email: "e@alvintang.me"
                // firstName: "asda"
                // id: 6
                // isActivated: false
                // isActive: false
                // lastName: "asd"
                // role: "voter"

                // TODO: Put this server side

                // if we created an election officer, then there is no voting service here, so update state and leave
                if (this.props.currentUser.role === UserRole.administrator) {
                    this.setState({ created: res.data, currentUser: {email: '', firstName: '', lastName: '' } })
                    return
                }
             
                client.mutate({
                    variables: { authId: `${res.data.id}`, district: this.state.districtChosen.id ? this.state.districtChosen.id : this.state.districts[0].id },
                    mutation: UPDATE_VOTER
                }).then(() => {
                    this.setState({ created: res.data, currentUser: {email: '', firstName: '', lastName: '' } });
                });
            }).catch((err) => {
                this.setState({ created: null, error: err.response.data.detail });
                console.log(err);
            });
    };

    render() {
        if (!this.state.loaded) return (<div>Loading...</div>);
        const roleForCreation = this.roleForCreation === UserRole.voter ? 'Voter' : 'Election Officer';

        return (
            <div>
                <h1>Create User: {roleForCreation}</h1>
                {
                    this.state.created && (
                        <div className="alert alert-success">
                            <h2>User Account Created</h2>
                            <p>A {roleForCreation} user account for {this.state.created.firstName} {this.state.created.lastName} has been created. They should expect an e-mail in their inbox shortly.</p>
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
                        <label className="required">
                            E-mail address:
                            <input type="email"
                                   className="form-control"
                                   value={this.state.currentUser.email}
                                   onChange={this.handleEmailChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="required">
                            First Name:
                            <input type="text"
                                   className="form-control"
                                   value={this.state.currentUser.firstName}
                                   onChange={this.handleFirstNameChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="required">
                            Last Name:
                            <input type="text"
                                   className="form-control"
                                   value={this.state.currentUser.lastName}
                                   onChange={this.handleLastNameChange}
                                   required />
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
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps)(UserCreate);
