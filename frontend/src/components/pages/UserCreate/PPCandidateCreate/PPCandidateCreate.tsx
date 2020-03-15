import React, { Component } from 'react';

interface Props {
    currentUser: User
}

interface State {
    name: string,
    district: string,
    politicalParty: string
}



export class PPCandidateCreate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {districtName: ""}
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePPChange = this.handlePPChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDistrictChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({district: event.currentTarget.value});
    }
    handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({name: event.currentTarget.value});
    }
    handlePPChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({politicalParty: event.currentTarget.value});
    }

    handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        console.log("submitted");
    }
    render() {
        return (
            <div>
                <h1>Create Political Party Candidate</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>
                            Candidate Name:
                            <input type="text" className="form-control"
                            placeholder="Candidate name" value={this.state.name} onChange={this.handlePPChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Candidate Political Party:
                            <input type="text" className="form-control"
                            placeholder="Candidate political party" value={this.state.politicalParty} onChange={this.handleNameChange} required/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            District Name:
                            <input type="text" className="form-control"
                            placeholder="District name" value={this.state.district} onChange={this.handleDistrictChange} required/>
                        </label>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            </div>
        );
    }
}

export default PPCandidateCreate;

