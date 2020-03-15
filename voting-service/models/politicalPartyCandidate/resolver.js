const PoliticalPartyCandidate = require('./schema').PoliticalPartyCandidates;
const PoliticalPartyResolver = require('../politicalParty/resolver');
const DistrictResolver = require('../district/resolver');
const authRoles = require('../../authRoles').resolverToRole;
const {
  ApolloError,
} = require('apollo-server-express');


const getPoliticalPartyCandidates = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getPoliticalPartyCandidates')) throw new Error(`User ${context.payload.role} cannot access resolver getPoliticalPartyCandidates`);

  return PoliticalPartyCandidate.find({});
};

const getPoliticalPartyCandidate = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getPoliticalPartyCandidate')) throw new Error(`User ${context.payload.role} cannot access resolver getPoliticalPartyCandidate`);

  PoliticalPartyCandidate.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getPoliticalPartyForCandidate = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getPoliticalPartyForCandidate')) throw new Error(`User ${context.payload.role} cannot access resolver getPoliticalPartyForCandidate`);

  PoliticalPartyCandidate.find({ _id: args.id }, (err, res) => {
    // console.log(res[0])
    err ? reject(err) : resolve({ political_party: res[0].political_party });
    if (err == null) { return reject(); }
  });
});

const addPoliticalPartyCandidate = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addPoliticalPartyCandidate')) throw new ApolloError(`User ${context.payload.role} cannot access resolver addPoliticalPartyCandidate`);

  const newPoliticalPartyCandidate = new PoliticalPartyCandidate({
    name: args.name,
    political_party: args.political_party,
    district: args.district,
  });

  return new Promise((resolve, reject) => {
    // check political party exists
    PoliticalPartyResolver.getPoliticalParty(null, { id: args.political_party })
      .then((e) => {
        if (e == null) { return reject(new ApolloError('The political party does not exist')); }

        // check district exists
        DistrictResolver.getDistrict(null, { id: args.district })
          .then((e) => {
            if (e == null) { return reject(new ApolloError('The district does not exist')); }

            // we can add
            newPoliticalPartyCandidate.save((err, res) => {
              err ? reject(err) : resolve(res);
            });
          })
          .catch((e) => {
            return reject(new ApolloError('The political party does not exist'));
          });
      })
      .catch((e) => {
        reject(new ApolloError('The political party does not exist'));
      });
  });
};

const updatePoliticalPartyCandidate = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('updatePoliticalPartyCandidate')) throw new Error(`User ${context.payload.role} cannot access resolver updatePoliticalPartyCandidate`);

  PoliticalPartyResolver.getPoliticalParty(null, { id: args.political_party })
    .then((e) => {
      // check district is good
      DistrictResolver.getDistrict(null, { id: args.district })
        .then(
          // we can add
          PoliticalPartyCandidate.findOneAndUpdate({ _id: args.id },
            {
              $set:
              { name: args.name, political_party: args.political_party, district: args.district },
            }, { new: true },
            (err, res) => {
              err ? reject(err) : resolve(res);
            }),
        )
        .catch((e) => {
          reject(new Error('The district does not exist'));
        });
    })
    .catch((e) => {
      reject(new Error('The political party does not exist'));
    });
});

const deletePoliticalPartyCandidate = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('deletePoliticalPartyCandidate')) throw new Error(`User ${context.payload.role} cannot access resolver deletePoliticalPartyCandidate`);

  PoliticalPartyCandidate.findByIdAndRemove({ _id: args.id }, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});


module.exports = {
  getPoliticalPartyCandidates,
  getPoliticalPartyCandidate,
  getPoliticalPartyForCandidate,
  addPoliticalPartyCandidate,
  updatePoliticalPartyCandidate,
  deletePoliticalPartyCandidate,
};
