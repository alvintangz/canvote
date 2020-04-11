import React from 'react';
import users from '../api/users';
import {UserRole} from '../enums/role';
import {AxiosResponse} from "axios";
import {User} from "../interfaces/models/user";
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
    users: User[];
    searchProper: object;
    total: {
        items: number;
        pages: number;
    };
    current: {
        page: number;
        size: number;
    };
}

class UserList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            search: '', 
            results: [], 
            users: [], 
            total: {
                items: null,
                pages: null
            },
            current: {
                page: null,
                size: null
            },
            searchProper: {
                first_name: "",
                last_name: "",
                email: "",
                page: 1,
                size: 25,                
            }
        };
    }

    retrieveData = (e) => {
        let userSearch = this.state.searchProper;
        let userRole = this.props.currentUser.role === UserRole.administrator ? UserRole.election_officer : UserRole.voter

        users.listByRoleNamePage(userRole, userSearch)
        .then((result: AxiosResponse<User[]>) => {
            this.setState({total: result.data.total});
            this.setState({current: result.data.current});

            this.setState({ users: result.data.results });
        }).catch(error => console.log(error));
    }

    componentDidMount() {
        this.retrieveData();
    }

    handleSearchChange = (event: React.FormEvent<HTMLInputElement>, key): void => {
        console.log(key)
        let clone = this.state.searchProper;
        clone[key] = event.currentTarget.value;
        clone.page = 1;
        this.setState((prevState) => ({
            searchProper: clone
        }), () => this.retrieveData());
    };

    handlePrevPageChange = (event: React.FormEvent<HTMLInputElement>): void => {
        event.preventDefault()
        if (this.state.searchProper.page > 1) {
            let clone = this.state.searchProper
            clone.page -= 1
            this.setState({searchProper: clone}, function() {
                this.retrieveData();
            })
        }
    };

    handleNextPageChange = (event: React.FormEvent<HTMLInputElement>): void => {
        event.preventDefault()
        
        if (this.state.searchProper.page < this.state.total.pages) {
            let clone = this.state.searchProper
            clone.page += 1
            this.setState({searchProper: clone}, function() {
                console.log(this.state.searchProper.page)
                this.retrieveData();
            })
        }
    };

    resetSearches = (event: React.FormEvent<HTMLInputElement>): void => {
        event.preventDefault()
        this.setState({
            searchProper: {
                first_name: "",
                last_name: "",
                email: "",
                page: 1,
                size: 2,                
            }
        }, () => this.retrieveData())        
    }

    paginationSetup = () => {
        let result = []
        for (let i = 1; i <= this.state.total.pages; i++) {
            let classNameDecide = this.state.current.page === i ? "active" : ""
            result.push(
                <li className={classNameDecide} key={i}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault()
                        let clone = this.state.searchProper
                        clone.page = i
                        this.setState({ searchProper: clone }, () => this.retrieveData())
                    }}>{i} <span className="wb-inv">Go to Page {i}</span></a>
                </li>)   
        }
        return result


    }

    render() {
        const formStyles = {
            marginLeft: 0,
            
        }

        return (
            <div>
                <div className="header-flex w-bottom-border mb-2">
                    <h1>{this.props.currentUser.role === UserRole.administrator ? 'Election Officers' : 'Voters'}</h1>
                    <Link to="/manage/users/new" className="btn-success btn btn-sm">
                        Add {this.props.currentUser.role === UserRole.administrator ? 'Election Officer' : 'Voter'}
                    </Link>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading header-flex">
                        <h2 className="panel-title">Filters</h2>
                        <button className="btn-warning btn btn-sm" onClick={this.resetSearches}>Clear filters</button>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="form-group col-sm-4" style={formStyles}>
                                <label className="control-label w-100">
                                    First Name
                                    <input type="text" 
                                           value={ this.state.searchProper.first_name} 
                                           className="form-control w-100"
                                           placeholder="e.g. Thierry" 
                                           onChange={(e) => this.handleSearchChange(e, 'first_name')} />
                                </label>
                            </div>
                            <div className="form-group col-sm-4" style={formStyles}>
                                <label className="control-label w-100">
                                    Last Name
                                    <input type="text" 
                                           value={ this.state.searchProper.last_name} 
                                           className="form-control w-100"
                                           placeholder="e.g. Sans" 
                                           onChange={(e) => this.handleSearchChange(e, 'last_name')} />
                                </label>
                            </div>
                            <div className="form-group col-sm-4" style={formStyles}>
                                <label className="control-label w-100">
                                    Email
                                    <input type="text" 
                                           value={ this.state.searchProper.email} 
                                           className="form-control w-100" 
                                           placeholder="e.g. thierry.sans@gmail.com"
                                           onChange={(e) => this.handleSearchChange(e, 'email')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel panel-default">
                    <table className="table table-hover">
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
                                    <td><a href={ `mailto:${user.email}` } title="Email user">{ user.email }</a></td>
                                </tr>)
                            )}
                        </tbody>
                    </table>
                    { this.state.users.length === 0 ? <div className="panel-body"><p>No results</p></div> : null}

                    {
                        this.state.current ? 
                            <div className="panel-body text-center">
                                <ul className="pagination pagination-sm">
                                    <li><a href="#" rel="prev" onClick={this.handlePrevPageChange} disable={`${this.state.current.page === 1}`}>Previous</a></li>
                                    {
                                        this.paginationSetup()
                                    }
                                    <li><a href="#" rel="next" onClick={this.handleNextPageChange} disable={`${this.state.current.page === this.state.total.pages}`}>Next</a></li>  
                                </ul>
                                <div>
                                    <small>Page {this.state.current.page} of {this.state.total.pages}</small>
                                </div>
                            </div>

                        : null
                    }
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(UserList)
