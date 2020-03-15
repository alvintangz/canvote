import React from 'react';
import './UserList.scss';
import users from '../../../api/users';
import { UserRole } from '../../../enums/role';
import { AxiosResponse } from "axios";
import { User } from "../../../interfaces/user";
import { Link } from "react-router-dom";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return ({currentUser: state.authReducer.user});
};

interface Props {
    currentUser: User;
}

interface State {
    search: string;
    results: string[];
    renderList: JSX.Element[];
    page: number;
    maxPage: number;
}

class UserList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {search: '', results: [], renderList: [], page: 1, maxPage: 1};
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handlePrevPageChange = this.handlePrevPageChange.bind(this);
        this.handleNextPageChange = this.handleNextPageChange.bind(this);
    }

    renderedResults = (list: User[]) => {
        const result = list.map((user, index) => {
            return (<tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link to={`/manage/users/${user.id}`}>
                                    <button className="btn btn-primary">
                                        Edit User
                                    </button>
                                </Link>
                            </td>
                    </tr>)
        })

        this.setState({renderList: result});

    };

    retrieveData = () => {
        let splitSearch = this.state.search.split(" ");

        const userSearch: ListUsersOptions = {
            first_name: splitSearch[0],
            last_name: splitSearch[1] ? splitSearch[1] : '',
            page: this.state.page,
        };

        if (this.props.currentUser.role === UserRole.administrator) {
            users.listByRoleNamePage(UserRole.election_officer, userSearch)
            .then((result: AxiosResponse<User[]>) => {
                this.setState({maxPage: result.data.total.pages});
                this.renderedResults(result.data.results);
            })
            .catch(error => console.log(error));
        } else {
            users.listByRoleNamePage(UserRole.voter, userSearch)
            .then((result: AxiosResponse<User[]>) => {
                this.setState({maxPage: result.data.total.pages});
                this.renderedResults(result.data.results);
            })
            .catch((error) => console.log(error));
        }
    }

    componentDidMount() {
        this.retrieveData();
    }


    handleSearchChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({search: event.currentTarget.value, page: 1}, function() {
            this.retrieveData();
        });
    }

    handlePrevPageChange(event: React.FormEvent<HTMLInputElement>): void {
        if (this.state.page > 1) {
            this.setState({page: this.state.page-1}, function() {
                this.retrieveData();
            })
        }
    }

    handleNextPageChange(event: React.FormEvent<HTMLInputElement>): void {
        if (this.state.page < this.state.maxPage) {
            this.setState({page: this.state.page+1}, function() {
                this.retrieveData();
            })
        }
    }

    render() {
        return (
            <div>
                <ul className="pager well well-sm">
                    <li className="previous">
                        <button className="btn btn-default pull-left" onClick={() => this.handlePrevPageChange} disabled={this.state.page === 1}> Previous Page </button>
                    </li>
                    Current page: {this.state.page}
                    <li className="next">
                        <button className="btn btn-default pull-right" onClick={() => this.handleNextPageChange} disabled={this.state.page >= this.state.maxPage}> Next Page </button>
                    </li>
                </ul>
                <form>
                    <div className="form-group">
                        <label>
                             Search By Full Name: &nbsp;
                             <input type="text" value = {this.state.search} onChange={this.handleSearchChange} />
                        </label>
                    </div>
                </form>
                <table className="wb-tables table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.renderList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(UserList)
