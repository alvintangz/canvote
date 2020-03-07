const { gql, makeExecutableSchema } = require("apollo-server-express");

const DistrictResolver = require('./models/district/resolver')
const PoliticalPartyResolver = require('./models/politicalParty/resolver')
const PoliticalPartyCandidateResolver = require('./models/politicalPartyCandidate/resolver')


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

  type politicalPartyCandidate {
    id: ID!
    name: String!
    political_party: String!
    district: String!
  }

  type Query {
    getPoliticalParties: [PoliticalParty]
    getPoliticalParty(id: ID!): PoliticalParty

    getDistricts: [District]
    getDistrict(id: ID!): District

    
    getPoliticalPartyCandidates: [politicalPartyCandidate]
    getPoliticalPartyCandidate(id: ID!): politicalPartyCandidate

  }
  type Mutation {
    addPoliticalParty(name: String!, colour: String!): PoliticalParty
    updatePoliticalParty(id: ID!, name: String!, colour: String!): PoliticalParty
    deletePoliticalParty(id: ID!): PoliticalParty

    addDistrict(name: String!): District

    addPoliticalPartyCandidate(name: String!, political_party: String!, district: String!): politicalPartyCandidate
    updatePoliticalPartyCandidate(id: ID!, name: String!, political_party: String!, district: String!): politicalPartyCandidate
    deletePoliticalPartyCandidate(id: ID!): politicalPartyCandidate
  }
`;

const resolvers = {
  Query: {
    getPoliticalParties: PoliticalPartyResolver.getPoliticalParties,
    getPoliticalParty: PoliticalPartyResolver.getPoliticalParty,

    getDistricts: DistrictResolver.getDistricts,
    getDistrict: DistrictResolver.getDistrict,

    getPoliticalPartyCandidates: PoliticalPartyCandidateResolver.getPoliticalPartyCandidates,
    getPoliticalPartyCandidate: PoliticalPartyCandidateResolver.getPoliticalPartyCandidate

  },
  Mutation: {
    addPoliticalParty: PoliticalPartyResolver.addPoliticalParty,
    updatePoliticalParty: PoliticalPartyResolver.updatePoliticalParty,
    deletePoliticalParty: PoliticalPartyResolver.deletePoliticalParty,

    addDistrict: DistrictResolver.addDistrict,

    addPoliticalPartyCandidate: PoliticalPartyCandidateResolver.addPoliticalPartyCandidate,
    updatePoliticalPartyCandidate: PoliticalPartyCandidateResolver.updatePoliticalPartyCandidate,
    deletePoliticalPartyCandidate: PoliticalPartyCandidateResolver.deletePoliticalPartyCandidate

  }
};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: resolvers
});
