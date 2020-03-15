import React, { Component } from 'react';
import {Link} from "react-router-dom";
import './UserUpdate.scss';
import auth from '../../../api/auth';
import { AxiosResponse, AxiosError } from 'axios';
import users from '../../../api/users';
import { UserRole } from '../../../enums/role';
import { User } from "../../../interfaces/user";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};


interface Props {
    currentUser: User
}

interface State {
    email: string,
    firstName: string,
    lastName: string,
    userId: number,
    isActive: boolean,
    role: UserRole.voter | UserRole.election_officer
}


export class UserUpdate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {email: "", firstName: "", lastName: "", userId: -1, isActive: false, role: UserRole.election_officer}
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    componentDidMount() {
        console.log(this.props.currentUser.role)

        this.setState({userId: this.props.match.params.userId}, () => {
            users.retrieveByRole(this.props.currentUser.role === UserRole.voter ? UserRole.election_officer : UserRole.voter
                , this.state.userId)
            .then((e) => {
                console.log(e.data)
                this.setState({
                    email: e.data.email,
                    firstName: e.data.firstName,
                    lastName: e.data.lastName,
                    isActive: e.data.isActive,
                    role: e.data.role === 'election_officer' ? UserRole.election_officer : UserRole.voter
                })
            })
            .catch((e) => console.log(e.data))        
        });


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

    handleCheckChange(event: React.FormEvent<HTMLInputElement>): void {    
        const target = event.target;
        const name = target.name;
    
        this.setState({
          isActive: target.checked
        });
    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        console.log("submitted")
        console.log(this.state)

        const toUpdate : User = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            isActive: this.state.isActive        

        };

        users.updateByRole(this.state.role, this.state.userId, toUpdate)
            .then((e) => console.log(e))
            .catch((e) => console.log(e))


        // id?: number;
        // email: string;
        // firstName: string;
        // lastName: string;
        // role?: UserRole;
        // isActivated?: boolean;
        // isActive?: boolean;


        // users.

        // realistically I have to see if the role is admin or election offer
        // if admin, I create election officer
        // if election offer, I create voter
        // const jsonObj : User = {
        //     email: this.state.email,
        //     firstName: this.state.firstName,
        //     lastName: this.state.lastName
        // }
        
        // users.createByRole(UserRole.election_officer, jsonObj)
        //     .then((result) => {
        //         console.log(result);
        //     }).catch((err) => {
        //         console.log(err);                
        //     });

        // auth.loginFirst(this.state.email, this.state.password).then(() => {
        //     this.props.dispatch({ type: AuthActionType.LOGIN_SUCCESS })
        // }).catch((error: AxiosError) => {

        // });
    }

    render() {
        return (
            <div>
                <h1>Update User</h1>
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
                            placeholder="Last Name" value={this.state.lastName} onChange={this.handleLastNameChange} required/>
                        </label>
                    </div>
                    <div className="form-group bg-warning">
                        <label>
                            <input type="checkbox" value="" style={{marginRight: '5px'}} onChange={this.handleCheckChange}
                            checked={this.state.isActive}/>
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
