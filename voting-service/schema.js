const { gql, makeExecutableSchema } = require('apollo-server-express');

const DistrictResolver = require('./models/district/resolver');
const PoliticalPartyResolver = require('./models/politicalParty/resolver');
const PoliticalPartyCandidateResolver = require('./models/politicalPartyCandidate/resolver');
const VoterResolver = require('./models/voter/resolver');
const BallotResolver = require('./models/ballot/resolver');
const VoteResolver = require('./models/vote/resolver');


const typeDefs = gql`
  type PoliticalParty {
    id: ID!
    name: String!
    colour: String!
  }

  type District {
    id: ID!
    name: String!
  }

  type PoliticalPartyCandidate {
    id: ID!
    name: String!
    political_party: String!
    district: String!
  }

  type Voter {
    id: ID!
    email: String!
  }

  type Ballot {
    id: ID!
    candidate: String!
    timestamp: String
  }

  type Vote {
    id: ID!
    voter: String!
    timestamp: String
  }

  type Query {
    getPoliticalParties: [PoliticalParty]
    getPoliticalParty(id: ID!): PoliticalParty

    getDistricts: [District]
    getDistrict(id: ID!): District

    
    getPoliticalPartyCandidates: [PoliticalPartyCandidate]
    getPoliticalPartyCandidate(id: ID!): PoliticalPartyCandidate

    getVoters: [Voter]
    getVoter(id: ID!): Voter

    getBallots: [Ballot]
    getBallot(id: ID!): Ballot
    getBallotByCandidate(candidate: String!): [Ballot]
    getBallotByPoliticalParty(political_party: String!): [Ballot]

    getVotes: [Vote]
    getVote(id: ID!): Vote

  }
  type Mutation {
    addPoliticalParty(name: String!, colour: String!): PoliticalParty
    updatePoliticalParty(id: ID!, name: String!, colour: String!): PoliticalParty
    deletePoliticalParty(id: ID!): PoliticalParty

    addDistrict(name: String!): District
    updateDistrict(id: ID!, name: String!): District
    deleteDistrict(id: ID!): District


    addPoliticalPartyCandidate(name: String!, political_party: String!, district: String!): PoliticalPartyCandidate
    updatePoliticalPartyCandidate(id: ID!, name: String!, political_party: String!, district: String!): PoliticalPartyCandidate
    deletePoliticalPartyCandidate(id: ID!): PoliticalPartyCandidate

    addVoter(email: String!): Voter

    addBallot(candidate: String!): Ballot

    addVote(voter: String!): Vote
  }
`;

const resolvers = {
  Query: {
    getPoliticalParties: PoliticalPartyResolver.getPoliticalParties,
    getPoliticalParty: PoliticalPartyResolver.getPoliticalParty,

    getDistricts: DistrictResolver.getDistricts,
    getDistrict: DistrictResolver.getDistrict,

    getPoliticalPartyCandidates: PoliticalPartyCandidateResolver.getPoliticalPartyCandidates,
    getPoliticalPartyCandidate: PoliticalPartyCandidateResolver.getPoliticalPartyCandidate,

    getVoters: VoterResolver.getVoters,
    getVoter: VoterResolver.getVoter,

    getBallots: BallotResolver.getBallots,
    getBallot: BallotResolver.getBallot,
    getBallotByCandidate: BallotResolver.getBallotByCandidate,
    getBallotByPoliticalParty: BallotResolver.getBallotByPoliticalParty,

    getVotes: VoteResolver.getVotes,
    getVote: VoteResolver.getVote,

  },
  Mutation: {
    addPoliticalParty: PoliticalPartyResolver.addPoliticalParty,
    updatePoliticalParty: PoliticalPartyResolver.updatePoliticalParty,
    deletePoliticalParty: PoliticalPartyResolver.deletePoliticalParty,

    addDistrict: DistrictResolver.addDistrict,
    updateDistrict: DistrictResolver.updateDistrict,
    deleteDistrict: DistrictResolver.deleteDistrict,

    addPoliticalPartyCandidate: PoliticalPartyCandidateResolver.addPoliticalPartyCandidate,
    updatePoliticalPartyCandidate: PoliticalPartyCandidateResolver.updatePoliticalPartyCandidate,
    deletePoliticalPartyCandidate: PoliticalPartyCandidateResolver.deletePoliticalPartyCandidate,

    addVoter: VoterResolver.addVoter,

    addBallot: BallotResolver.addBallot,

    addVote: VoteResolver.addVote,


  },
};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers,
});
