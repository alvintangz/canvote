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
    lastName: string
}

export class UserCreate extends Component<Props, State> {
    private roleForCreation;
    constructor(props: Props) {
        super(props);

        this.roleForCreation = this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter;
        this.state = {
            email: null,
            firstName: null,
            lastName: null
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
        const jsonObj : User = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        };
        users.createByRole(
            this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter,
            jsonObj
        ).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    };

    render() {
        return (
            <div>
                <h1>Add {this.roleForCreation === UserRole.voter ? 'Voter' : 'Election Officer'}</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            E-mail address:
                            <input type="email"
                                   className="form-control"
                                   value={this.state.email}
                                   onChange={this.handleEmailChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            First Name:
                            <input type="text"
                                   className="form-control"
                                   value={this.state.firstName}
                                   onChange={this.handleFirstNameChange}
                                   required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
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
