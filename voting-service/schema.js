const { gql, makeExecutableSchema } = require("apollo-server-express");

const DistrictResolver = require('./models/district/resolver')
const PoliticalPartyResolver = require('./models/politicalParty/resolver')
const PoliticalPartyCandidateResolver = require('./models/politicalPartyCandidate/resolver')
const VoterResolver = require('./models/voter/resolver')


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

  type Query {
    getPoliticalParties: [PoliticalParty]
    getPoliticalParty(id: ID!): PoliticalParty

    getDistricts: [District]
    getDistrict(id: ID!): District

    
    getPoliticalPartyCandidates: [PoliticalPartyCandidate]
    getPoliticalPartyCandidate(id: ID!): PoliticalPartyCandidate

    getVoters: [Voter]
    getVoter(id: ID!): Voter

  }
  type Mutation {
    addPoliticalParty(name: String!, colour: String!): PoliticalParty
    updatePoliticalParty(id: ID!, name: String!, colour: String!): PoliticalParty
    deletePoliticalParty(id: ID!): PoliticalParty

    addDistrict(name: String!): District

    addPoliticalPartyCandidate(name: String!, political_party: String!, district: String!): PoliticalPartyCandidate
    updatePoliticalPartyCandidate(id: ID!, name: String!, political_party: String!, district: String!): PoliticalPartyCandidate
    deletePoliticalPartyCandidate(id: ID!): PoliticalPartyCandidate

    addVoter(email: String!): Voter

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
    getVoter: VoterResolver.getVoter

  },
  Mutation: {
    addPoliticalParty: PoliticalPartyResolver.addPoliticalParty,
    updatePoliticalParty: PoliticalPartyResolver.updatePoliticalParty,
    deletePoliticalParty: PoliticalPartyResolver.deletePoliticalParty,

    addDistrict: DistrictResolver.addDistrict,

    addPoliticalPartyCandidate: PoliticalPartyCandidateResolver.addPoliticalPartyCandidate,
    updatePoliticalPartyCandidate: PoliticalPartyCandidateResolver.updatePoliticalPartyCandidate,
    deletePoliticalPartyCandidate: PoliticalPartyCandidateResolver.deletePoliticalPartyCandidate,

    addVoter: VoterResolver.addVoter

  }
};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: resolvers
});
