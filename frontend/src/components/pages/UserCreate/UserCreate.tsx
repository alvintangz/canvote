import React, {Component} from 'react';
import './UserCreate.scss';
import users from '../../../api/users';
import {UserRole} from '../../../enums/role';
import {User} from "../../../interfaces/user";
import {connect} from "react-redux";


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
}

export class UserCreate extends Component<Props, State> {
    private roleForCreation;

    constructor(props: Props) {
        super(props);

        this.roleForCreation = this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter;
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            created: null
        };
    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({email: event.currentTarget.value});
    };

    handleFirstNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({firstName: event.currentTarget.value});
    };

    handleLastNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({lastName: event.currentTarget.value});
    };

    handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        users.createByRole(
            this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter,
            {
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            }).then((res) => {
                this.setState({ created: res.data, email: '', firstName: '', lastName: '' });
            }).catch((err) => {
                this.setState({ created: null });
                console.log(err);
            });
    };

    render() {
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
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps)(UserCreate);
