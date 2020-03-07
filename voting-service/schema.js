const { gql, makeExecutableSchema } = require("apollo-server-express");

const PoliticalParty = require("./models/politicalParty").PoliticalParties;
const District = require("./models/district").Districts;


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
    getPoliticalParties: (parent, args) => {
      return PoliticalParty.find({});
    },
    getPoliticalParty: (parent, args) => {
      return new Promise((resolve, reject) => {
        PoliticalParty.findById(args.id, (err, res) => {
          err ? reject(err) : resolve(res)
        })
      })
    },
    getDistricts: (parent, args) => {
      return District.find({});
    },
    getDistrict: (parent, args) => {
      return new Promise((resolve, reject) => {
        District.findById(args.id, (err, res) => {
          err ? reject(err) : resolve(res)
        })
      })
    },

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
    },

    addDistrict: (parent, args) => {
      let newDistrict = new District({
        name: args.name
      });
      return new Promise((resolve, reject) => {
        newDistrict.save((err, res) => {
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
