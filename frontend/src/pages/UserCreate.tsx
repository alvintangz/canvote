import React, {Component} from 'react';
import users from '../api/users';
import {UserRole} from '../enums/role';
import {User} from "../interfaces/user";
import {connect} from "react-redux";
import gql from 'graphql-tag';
import client from "../api/apolloClient";


const mapStateToProps = (state) => {
    return ({currentUser: state.authReducer.user});
};

interface Props {
    currentUser: User
}

interface State {
    email: string,
    firstName: string,
    lastName: string,
    created: User,
    loaded: boolean,
    districtChosen: {
        id: string,
        name: string
    },
    districts: {
        id: string,
        name: string
    }[],
}

const GET_DISTRICTS = gql`
    query {
        getDistricts {
            id
            name
        }
    }
`;

const ADD_VOTER = gql`
    mutation addVoter($email: String!, $district: String!) {
        addVoter(email: $email, district: $district) {
            email
            district
        }
    }
`;


export class UserCreate extends Component<Props, State> {
    private roleForCreation;

    constructor(props: Props) {
        super(props);

        this.roleForCreation = this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter;
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            loaded: false,
            created: null,
            districts: [],
            districtChosen: { id: '', name: '' }
        };
    }

    componentDidMount() {
        client.query({
            query: GET_DISTRICTS,
        }).then(data => {
            this.setState({
                districts: data.data.getDistricts
            });
        }).catch(error => console.error(error))
            .finally(() => {
                this.setState({ loaded: true });
            });
    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ email: event.currentTarget.value });
    };

    handleFirstNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ firstName: event.currentTarget.value });
    };

    handleLastNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ lastName: event.currentTarget.value });
    };

    handleDistrictChange = (event: React.FormEvent<HTMLInputElement>): void => {
        let id = event.currentTarget.value;
        let name = this.state.districts.filter((d) => d.id === event.currentTarget.value)[0].name;
        this.setState({ districtChosen: { id: id, name: name}})
    };

    handleSubmit = (event: React.SyntheticEvent): void => {
        if (this.state.districtChosen.name === '') {
            this.setState({ districtChosen: {
                id: this.state.districts[0].id,
                name: this.state.districts[0].name
            }});
        }

        event.preventDefault();
        users.createByRole(
            this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter,
            {
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            }).then((res) => {
                // TODO: Put this server side
                client.mutate({
                    variables: { email: this.state.email, district: this.state.districtChosen.id },
                    mutation: ADD_VOTER
                }).then(() => {
                    this.setState({ created: res.data, email: '', firstName: '', lastName: '' });
                });
            }).catch((err) => {
                this.setState({ created: null });
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
                        </div>
                    )
                }
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="required">
                            E-mail address:
                            <input type="email"
                                   className="form-control"
                                   value={this.state.email}
                                   onChange={this.handleEmailChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="required">
                            First Name:
                            <input type="text"
                                   className="form-control"
                                   value={this.state.firstName}
                                   onChange={this.handleFirstNameChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="required">
                            Last Name:
                            <input type="text"
                                   className="form-control"
                                   value={this.state.lastName}
                                   onChange={this.handleLastNameChange}
                                   required />
                        </label>
                    </div>
                    {
                        roleForCreation === 'Voter' ?

                        <div className="form-group">
                            <label className="required">
                                District:
                                <select className="form-control"
                                        value={this.state.districtChosen.name ? this.state.districtChosen.name : ''}
                                        onChange={this.handleDistrictChange}>
                                    {
                                        this.state.districts.map((district) =>
                                            <option key={district.id} value={district.id}>{district.name}</option>)
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
