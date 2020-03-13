const resolverToRole = {
  administrator: [
    'getPoliticalPartyCandidates', 'getPoliticalPartyCandidate', 'addPoliticalPartyCandidate', 'updatePoliticalPartyCandidate', 'deletePoliticalPartyCandidate',
    'getPoliticalParties', 'getPoliticalParty', 'getPoliticalPartyByName', 'addPoliticalParty', 'updatePoliticalParty', 'deletePoliticalParty',
    'addDistrict', 'getDistrict', 'getDistricts', 'getDistrictByName',
  ],
  electionOfficer: [
    'addVoter', 'getVoters', 'getVoter', 'getVoterByEmail',
  ],
  voter: [
    'addVote', 'addBallot',
  ],
  externalViewer: [
    'getBallot', 'getBallotByCandidate', 'getBallots',
  ],
};

module.exports = { resolverToRole };


/*
Ability for Administrative Officers to create, update and delete Election Officers,
political parties, ridings and candidates

Ability for Election Officers to create, update, and delete Voters

User authentication completed without facial and voice recoginition
Ability for the voter to vote (only vote once in their assigned electoral district)
*/
