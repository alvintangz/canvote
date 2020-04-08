import { combineResolvers } from 'graphql-resolvers';
import { isAdministrator } from './auth';
import { PoliticalParty, PoliticalPartyCandidate } from '../../models';
import { rejectErrorIfNeeded, rejectNotFoundIfNeeded } from './helpers';

const { ApolloError } = require('apollo-server-express');
const PoliticalPartyResolver = require('./politicalParty');
const DistrictResolver = require('./district');

export default {
  getPoliticalPartyCandidates: () => PoliticalPartyCandidate.find({}),
  getPoliticalPartyCandidate: (parent, args) => new Promise((resolve, reject) => {
    PoliticalPartyCandidate.findById(args.id, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  }),
  getPoliticalPartyCandidatesByDistrict: (district) => new Promise(((resolve, reject) => (
    PoliticalPartyCandidate.find({ district: district.id }, (err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Political Party Candidate', district.id)) return;
      resolve(res);
    })
  ))),
  getPoliticalPartyCandidatesByPoliticalParty: (politicalParty) => (
    new Promise(((resolve, reject) => (
      PoliticalPartyCandidate.find({ politicalParty: politicalParty.id }, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'Political Party Candidate', politicalParty.id)) return;
        resolve(res);
      })
    )))
  ),
  createPoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args, context) => {
    const newPoliticalPartyCandidate = new PoliticalPartyCandidate({
      name: args.name,
      political_party: args.political_party,
      district: args.district,
    });

    return new Promise((resolve, reject) => {
      // check political party exists
      PoliticalPartyResolver.default.Query.politicalParty(
        null, { name: args.political_party }, context,
      ).then((e) => {
        // check district exists
        DistrictResolver.default.Query.district(null, { name: args.district }, context)
          .then((e) => {
            if (e == null) {
              return reject(new ApolloError('The district does not exist'));
            }

            // we can add
            newPoliticalPartyCandidate.save((err, res) => {
              if (err) return reject(err);
              return resolve(res);
            });
          })
          .catch(() => reject(new ApolloError('The district does not exist')));
      }).catch(() => {
        reject(new ApolloError('The political party does not exist'));
      });
    });
  }),
  updatePoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args, context) => {
    PoliticalPartyResolver.default.Query.politicalParty(
      null, { name: args.political_party }, context
    ).then(() => {
      DistrictResolver.default.Query.district(null, { name: args.district }, context)
        .then(
          PoliticalPartyCandidate.findOneAndUpdate(
            { _id: args.id },
            {
              $set: {
                name: args.name,
                political_party: args.political_party,
                district: args.district
              },
            }, { new: true },
            (err, res) => {
              if (err) return reject(err);
              return resolve(res);
            },
          ),
        )
        .catch(() => {
          throw new Error('The district does not exist');
        });
    }).catch(() => {
      throw new Error('The political party does not exist');
    });
  }),
  deletePoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      PoliticalPartyCandidate.findByIdAndRemove({ _id: args.id }, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
        resolve(res);
      });
    })
  )),
};
