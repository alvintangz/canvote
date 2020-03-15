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
    'addDistrict', 'getPoliticalParties', 'getPoliticalPartyCandidates', 'addBallot',
    'addPoliticalParty', 'addPoliticalPartyCandidate', 'addVoter', 'deletePoliticalParty',
    'deletePoliticalPartyCandidate', 'getBallotByCandidate', 'getBallots', 'getDistrict',
    'getDistrictByName', 'getDistricts', 'getPoliticalParty', 'getPoliticalPartyByName',
    'getPoliticalPartyCandidate', 'getVoter', 'getVoterByEmail', 'getVoters',
    'updatePoliticalParty', 'updatePoliticalPartyCandidate', 'addVote', 'getBallot',
  ],
};

// replace externalViewer with the following to give it access to all methods, ONLY FOR TESTING
/*
externalViewer: [
  'addDistrict', 'getPoliticalParties', 'getPoliticalPartyCandidates', 'addBallot',
  'addPoliticalParty', 'addPoliticalPartyCandidate', 'addVoter', 'deletePoliticalParty',
  'deletePoliticalPartyCandidate', 'getBallotByCandidate', 'getBallots', 'getDistrict',
  'getDistrictByName', 'getDistricts', 'getPoliticalParty', 'getPoliticalPartyByName',
  'getPoliticalPartyCandidate', 'getVoter', 'getVoterByEmail', 'getVoters',
  'updatePoliticalParty', 'updatePoliticalPartyCandidate', 'addVote', 'getBallot',
],
*/

module.exports = { resolverToRole };


/*
Ability for Administrative Officers to create, update and delete Election Officers,
political parties, ridings and candidates

Ability for Election Officers to create, update, and delete Voters

User authentication completed without facial and voice recoginition
Ability for the voter to vote (only vote once in their assigned electoral district)
*/
