const { gql, makeExecutableSchema } = require("apollo-server-express");

const DistrictResolver = require('./models/district/resolver')
const PoliticalPartyResolver = require('./models/politicalParty/resolver')

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

  type Query {
    getPoliticalParties: [PoliticalParty]
    getPoliticalParty(id: ID!): PoliticalParty

    getDistricts: [District]
    getDistrict(id: ID!): District
  }
  type Mutation {
    addPoliticalParty(name: String!, colour: String!): PoliticalParty
    updatePoliticalParty(id: ID!, name: String!, colour: String!): PoliticalParty
    deletePoliticalParty(id: ID!): PoliticalParty

    addDistrict(name: String!): District
  }
`;

const resolvers = {
  Query: {
    getPoliticalParties: PoliticalPartyResolver.getPoliticalParties,
    getPoliticalParty: PoliticalPartyResolver.getPoliticalParty,

    getDistricts: DistrictResolver.getDistricts,
    getDistrict: DistrictResolver.getDistrict

  },
  Mutation: {
    addPoliticalParty: PoliticalPartyResolver.addPoliticalParty,
    updatePoliticalParty: PoliticalPartyResolver.updatePoliticalParty,
    deletePoliticalParty: PoliticalPartyResolver.deletePoliticalParty,

    addDistrict: DistrictResolver.addDistrict

  }
};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: resolvers
});
