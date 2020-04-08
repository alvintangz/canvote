import { combineResolvers } from 'graphql-resolvers';
import { isAdministrator } from './auth';
import { PoliticalParty, Media } from '../../models';
import {
  rejectErrorIfNeeded,
  rejectNotFoundIfNeeded,
  validationErrorToApolloUserInputError,
} from './helpers';

export default {
  getPoliticalParties: () => PoliticalParty.find({}),
  getPoliticalParty: (parent, args) => new Promise((resolve, reject) => (
    PoliticalParty.findById(args.id, (err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
      resolve(res);
    })
  )),
  getPoliticalPartyByCandidate: (candidate) => new Promise(((resolve, reject) => (
    PoliticalParty.findById(candidate.politicalParty, (err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Political Party', candidate.politicalParty)) return;
      resolve(res);
    })
  ))),
  createPoliticalParty: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      const politicalParty = new PoliticalParty({ name: args.name, colour: args.colour });
      politicalParty.validate().then(() => args.file.then((file) => (
        new Media().upload(file).then((media) => {
          politicalParty.logo = media;
          politicalParty.save((err, res) => {
            // TODO
            if (rejectErrorIfNeeded(err, reject)) {
              media.cleanAndRemoveById(media.id);
            }
            resolve(res);
          });
        })
      ))).catch((err) => reject(validationErrorToApolloUserInputError(err)));
    })
  )),
  updatePoliticalParty: combineResolvers(isAdministrator, ((parent, args) => (
    new Promise((resolve, reject) => {
      PoliticalParty.findOneAndUpdate({ _id: args.id }, {
        $set: {
          name: args.name,
          colour: args.colour,
        },
      }, {
        new: true,
        runValidators: true,
      }, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
        resolve(res);
      });
    })
  ))),
  deletePoliticalParty: combineResolvers(isAdministrator, ((parent, args) => (
    new Promise((resolve, reject) => {
      PoliticalParty.findByIdAndRemove({ _id: args.id }, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
        resolve(res);
      });
    })
  ))),
};
