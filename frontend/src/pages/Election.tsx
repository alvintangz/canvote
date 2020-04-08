import React from 'react';
import { DisplayDistricts } from '../components/District';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { District } from '../models/district';
import { UpdateDistrict } from '../components/District';


interface State {
    openSide: boolean;
    currentDistrict: District | null;
    editCurrentDistrict: boolean;
}


export class Election extends React.Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            openSide: false,
            currentDistrict: null,
            editCurrentDistrict: false
        };
    }

    handleAddDistrictBtnClick = () => {
        // TODO: Modal alert
        this.setState({ openSide: true, currentDistrict: null, editCurrentDistrict: true });
    };

    render() {
        const handleSelectedDistrict = (selectedDistrict: District) => {
            this.setState({ openSide: true, currentDistrict: selectedDistrict, editCurrentDistrict: false });
        };


        return (
            <div>
                <div className="clearfix page-header-container">
                    <div className="pull-left">
                        <h1>Election Admin</h1>
                    </div>
                    <div className="pull-right spaced-btn-group">
                        <button className="btn btn-default btn-sm" title="Manage Political Parties">
                            <FontAwesomeIcon icon={faEdit} className="fa-left" />Political Party
                        </button>
                        <button className="btn btn-default btn-sm" title="Manage Voters">
                            <FontAwesomeIcon icon={faEdit} className="fa-left" />Voters
                        </button>
                        <button className="btn btn-primary btn-sm" title="Add District" onClick={this.handleAddDistrictBtnClick}>
                            <FontAwesomeIcon icon={faPlus} className="fa-left" />District
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className={ this.state.openSide ? "col-md-8 col-lg-9" : "col-sm-12" }>
                        <DisplayDistricts handleSelectedDistrict={handleSelectedDistrict} />
                    </div>
                    { this.state.openSide &&
                        (
                            <div className="col-md-4 col-lg-3">
                                <div className="panel panel-default">
                                    {
                                        this.state.currentDistrict && this.state.currentDistrict.name && (
                                            <div className="panel-heading">
                                                <h2 className="h3 panel-title">{ this.state.currentDistrict.name }</h2>
                                            </div>
                                        )
                                    }
                                    <div className="panel-body">
                                    {
                                        this.state.editCurrentDistrict && <UpdateDistrict districtToUpdate={ this.state.currentDistrict } />
                                    }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}
