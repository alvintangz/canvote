import React from 'react';
import './UserList.scss';
import users from '../../../api/users';
import {UserRole} from '../../../enums/role';
import {AxiosResponse} from "axios";
import {User} from "../../../interfaces/user";
import {Link} from "react-router-dom";
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
    page: number;
    maxPage: number;
    users: User[];
}

class UserList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {search: '', results: [], users: [], page: 1, maxPage: 1};
    }

    retrieveData = () => {
        let splitSearch = this.state.search.split(" ");

        const userSearch = {
            first_name: splitSearch[0],
            last_name: splitSearch[1] ? splitSearch[1] : '',
            page: this.state.page,
        };

        if (this.props.currentUser.role === UserRole.administrator) {
            users.listByRoleNamePage(UserRole.election_officer, userSearch)
            .then((result: AxiosResponse<User[]>) => {
                this.setState({maxPage: result.data.total.pages});
                this.setState({ users: result.data.results });
            })
            .catch(error => console.log(error));
        } else {
            users.listByRoleNamePage(UserRole.voter, userSearch)
            .then((result: AxiosResponse<User[]>) => {
                this.setState({maxPage: result.data.total.pages});
                this.setState({ users: result.data.results });
            })
            .catch((error) => console.log(error));
        }
    };

    componentDidMount() {
        this.retrieveData();
    }


    handleSearchChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({search: event.currentTarget.value, page: 1}, function() {
            this.retrieveData();
        });
    };

    handlePrevPageChange = (event: React.FormEvent<HTMLInputElement>): void => {
        if (this.state.page > 1) {
            this.setState({page: this.state.page-1}, function() {
                this.retrieveData();
            })
        }
    };

    handleNextPageChange = (event: React.FormEvent<HTMLInputElement>): void => {
        if (this.state.page < this.state.maxPage) {
            this.setState({page: this.state.page+1}, function() {
                this.retrieveData();
            })
        }
    };

    render() {
        return (
            <div>
                <h1>{this.props.currentUser.role === UserRole.administrator ? 'Election Officers' : 'Voters'}</h1>
                <form>
                    <div className="form-group">
                        <label>
                             Search By Full Name: &nbsp;
                             <input type="text" value = {this.state.search} onChange={this.handleSearchChange} />
                        </label>
                    </div>
                </form>
                <Link to="/manage/users/new" className="btn-success btn">New User</Link>
                <table className="wb-tables table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user) => (
                            <tr key={user.id}>
                                <td scope="row"><Link to={`/manage/users/${user.id}`}>{user.firstName}</Link></td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                            </tr>)
                        )}
                    </tbody>
                </table>
            {/* <ul className="pagination pagination-sm">
                    <li><a href="#" rel="prev">Previous</a></li>
                    <li><a href="#">1 <span className="wb-inv">Go to Page 1</span></a></li>
                    <li><a href="#" rel="next">Next</a></li>
                </ul>
                     */}
            </div>
        )
    }
}

export default connect(mapStateToProps)(UserList)
