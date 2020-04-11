import { combineResolvers } from 'graphql-resolvers';
import { isElectionOfficer, isVoter } from './auth';
import { District, Voter } from '../../models';
import { rejectErrorIfNeeded, rejectNotFoundIfNeeded } from './helpers';
import axios from 'axios';
import { AUTH_SERVICE_BASE_URL, INTERNAL_API_KEY } from '../../config';
import { ApolloError } from 'apollo-server-express';

export default {
  getVoter: combineResolvers(isElectionOfficer, (parent, args) => new Promise((resolve, reject) => (
    Voter.findOne({ authId: args.id }, (err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Voter', args.id)) return;
      resolve(res);
    }))
  )),
  meAsVoter: combineResolvers(isVoter, (parent, args, { me }) => new Promise((resolve, reject) => {
    Voter.findOne({ authId: me.id }, (err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      resolve(res);
    })
  })),
  updateVoter: combineResolvers(isElectionOfficer, (parent, args) => new Promise((resolve, reject) => {
    // Check if district is valid
    District.findById(args.district, (err, district) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(district, reject, "District", args.district)) return;
      // District should be valid now, check if voter exists in auth service
      axios({
          url: `${AUTH_SERVICE_BASE_URL}/users/voters/${args.authId}`,
          method: 'get',
          headers: {
            'internal_auth': INTERNAL_API_KEY,
          }
      }).then(() => {
          Voter.findOneAndUpdate(
            { authId: args.authId }, {
              $set: {
                authId: args.authId,
                district,
              },
            }, {
              new: true,
              runValidators: true,
              upsert: true // Create new voter if doesn't exist
            }, (err, voter) => {
            if (!rejectErrorIfNeeded(err, reject)) resolve(voter);
          });
        }).catch(err => {
          if (err.status === 404) {
            if (rejectNotFoundIfNeeded(null, reject, "Voter", args.authId)) return;
          } else {
            return reject(new ApolloError("Error checking validity of user."));
          }
        });
    });
  })),
}
