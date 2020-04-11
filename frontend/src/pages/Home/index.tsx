import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import LinksByUserRole from './HomeLinks';
import Banner from './cover.jpg';
import {UserRole} from '../../enums/role';
import {GenericAlert} from "../../components/shared/Alert";
import {AlertType} from "../../enums/alert-type";

const mapStateToProps = state => {
    return { currentUser: state.authReducer.user };
};

const Home = (props) => {
    if (props.currentUser) {
        const { role } = props.currentUser;
        return (
            <div>
                {
                    (UserRole.voter === role) && (
                        <div className="panel panel-default">
                            <img src={Banner} alt="Your vote is our vote." className="img-fluid"/>
                        </div>
                    )
                }
                <h2 className="mb-1">Shortcuts</h2>
                <div className="row">
                    {
                        LinksByUserRole[
                            LinksByUserRole.findIndex(item => item.role === role)
                            ].links.map(link => (
                            <div className="col-lg-4 col-md-6" key={link.title}>
                                <h3>
                                    <Link to={link.linkTo}>{link.title}</Link>
                                </h3>
                                <p>{link.description}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }

    return (
        <div>
            <GenericAlert shouldShow={true}
                          message={<span>Please <Link to="/auth/login">login</Link> to continue using CanVote.</span> }
                          type={ AlertType.info } />
            <div className="panel panel-default">
                <img src={Banner} alt="Your vote is our vote." className="img-fluid"/>
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(Home);
