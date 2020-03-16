import React from 'react';
import './Home.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LinksByUserRole from './HomeLinks';
import Banner from '../../../cover.jpg';

const mapStateToProps = state => {
  return { currentUser: state.authReducer.user };
};

const Home = (props) => {
  if (props.currentUser) {
    const { firstName, lastName, role } = props.currentUser;
    return (
      <div className="container">
        <img src={Banner} alt="Your vote is our vote." className="img-fluid" />
        <hr />
        <h2>Shortcuts</h2>
        <div className="row">
          {LinksByUserRole[
            LinksByUserRole.findIndex(item => item.role === role)
          ].links.map(link => (
            <div className="col-lg-4 col-md-6" key={link.title}>
              <h3>
                <Link to={link.linkTo}>{link.title}</Link>
              </h3>
              <p>{link.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <p>Voting. Login!</p>
    </div>
  );
};

export default connect(mapStateToProps)(Home);
