import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => (
    <div>
        <div className="row">
            <div className="col-xs-3 col-sm-2 col-md-1 text-center mt-2"> 
                <FontAwesomeIcon icon={faExclamationTriangle} className="fa-fluid fa-red" />
            </div>
            <div className="col-xs-9 col-sm-10 col-md-11"> 
                <h1 className="mt-2">We couldn't find that Web page</h1> 
            </div>
        </div>
        <div className="my-1">
            <p>We're sorry you ended up here. The web page couldn't be found. If it was here before, it was most likely moved or deleted. Here are some options.</p>
            <ul>
                <li>Return to the <Link to="/">home page</Link></li>
            </ul>
        </div>
    </div>
);

export default NotFound;
