const { gql, makeExecutableSchema } = require("apollo-server-express");

const PoliticalParty = require("./models/politicalParty").PoliticalParties;

const typeDefs = gql`
  type PoliticalParty {
    id: ID!
    name: String!
    colour: String!
  }
  type Query {
    getPoliticalParties: [PoliticalParty]
    getPoliticalParty(id: ID!): PoliticalParty
  }
  type Mutation {
    addPoliticalParty(name: String!, colour: String!): PoliticalParty
    updatePoliticalParty(id: ID!, name: String!, colour: String!): PoliticalParty
    deletePoliticalParty(id: ID!): PoliticalParty
  }
`;

const resolvers = {
  Query: {
    getPoliticalParties: (parent, args) => {
      return PoliticalParty.find({});
    },
    getPoliticalParty: (parent, args) => {
      return new Promise((resolve, reject) => {
        PoliticalParty.findById(args.id, (err, res) => {
          err ? reject(err) : resolve(res)
        })
      })
    }
  },
  Mutation: {
    addPoliticalParty: (parent, args) => {
      let newPoliticalParty = new PoliticalParty({
        name: args.name,
        colour: args.colour
      });
      return new Promise((resolve, reject) => {
        newPoliticalParty.save((err, res) => {
          err ? reject(err) : resolve(res)
        })
      })
    },
    updatePoliticalParty: (parent, args) => {
      return new Promise((resolve, reject) => {
        PoliticalParty.findOneAndUpdate({_id: args.id},
          {$set: {name: args.name, colour: args.colour }}, { new: true },
          (err, res) => {
            err ? reject(err) : resolve(res)
          })
        })
    },
    deletePoliticalParty: (parent, args) => {
      return new Promise((resolve, reject) => {
        PoliticalParty.findByIdAndRemove({_id: args.id}, (err, res) => {
          err ? reject(err) : resolve(res)
        })
      })
    }
  }
};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: resolvers
});
