import React, { Component } from 'react';
import './UserCreate.scss';
import auth from '../../../api/auth';
import { AxiosResponse, AxiosError } from 'axios';
import users from '../../../api/users';
import { UserRole } from '../../../enums/role';
import { User } from "../../../interfaces/user";
import {connect} from "react-redux";
import PoliticalPartyCreate from "./PoliticalPartyCreate/PoliticalPartyCreate"
import PPCandidateCreate from "./PPCandidateCreate/PPCandidateCreate"


const mapStateToProps = state => {
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
    constructor(props: Props) {
        super(props);
        this.state = {email: "", firstName: "", lastName: ""}
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({email: event.currentTarget.value});
    }

    handleFirstNameChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({firstName: event.currentTarget.value});
    }

    handleLastNameChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({lastName: event.currentTarget.value});
    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();

        // realistically I have to see if the role is admin or election offer
        // if admin, I create election officer
        // if election offer, I create voter
        const jsonObj : User = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        
        users.createByRole(this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter, jsonObj)
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);                
            });

        // auth.loginFirst(this.state.email, this.state.password).then(() => {
        //     this.props.dispatch({ type: AuthActionType.LOGIN_SUCCESS })
        // }).catch((error: AxiosError) => {

        // });
    }

    render() {
        return (
            <div>
                <PoliticalPartyCreate />

                {/* <h1>Create User</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            E-mail address:
                            <input type="email" className="form-control"
                            placeholder="E-mail address" value={this.state.email} onChange={this.handleEmailChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            First Name:
                            <input type="text" className="form-control"
                            placeholder="First Name" value={this.state.firstName} onChange={this.handleFirstNameChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Last Name:
                            <input type="text" className="form-control"
                            placeholder="Last Name" value={this.state.lastName} onChange={this.handleLastNameChange} />
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form> */}
            </div>
        );
    }
}

export default connect(mapStateToProps)(UserCreate);
