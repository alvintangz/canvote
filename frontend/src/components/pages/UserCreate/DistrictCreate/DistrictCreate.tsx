import React, { Component } from 'react';

interface Props {
    currentUser: User,
}

interface State {
    districtName: string,
}



export class DistrictCreate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {districtName: ""}
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDistrictChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({districtName: event.currentTarget.value});
    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        console.log("submitted");
    }
    render() {
        return (
            <div>
                <h1>Create District</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            District Name:
                            <input type="text" className="form-control"
                            placeholder="District name" value={this.state.districtName} onChange={this.handleDistrictChange} required/>
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default DistrictCreate;

