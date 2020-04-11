import { combineResolvers } from 'graphql-resolvers';
import { isAdministrator } from './auth';
import { PoliticalParty, Media } from '../../models';
import { MediaUtility } from '../../models/media';
import {
  rejectErrorIfNeeded,
  rejectNotFoundIfNeeded,
  validationErrorToApolloUserInputError,
} from './helpers';
import sanitizeHTML from 'sanitize-html';

export default {
  getPoliticalParties: () => PoliticalParty.find({}).populate('logo').exec(),
  getPoliticalParty: (parent, args) => new Promise((resolve, reject) => (
    PoliticalParty.findById(args.id).populate('logo').exec((err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
      resolve(res);
    })
  )),
  getPoliticalPartyByCandidate: (candidate) => new Promise(((resolve, reject) => (
    PoliticalParty.findById(candidate.political_party).populate('logo').exec((err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Political Party', candidate.politicalParty)) return;
      resolve(res);
    })
  ))),
  createPoliticalParty: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      return args.logo.then(file => {
        MediaUtility.upload(file).then((media) => {
          const politicalParty = new PoliticalParty({
            name: sanitizeHTML(args.name), // Sanitize
            colour: sanitizeHTML(args.colour), // Sanitize
            logo: media
          });

          politicalParty.validate().then(() => {
            politicalParty.save((err, res) => {
              // TODO
              if (rejectErrorIfNeeded(err, reject)) {
                MediaUtility.delete(media.id);
              }
              resolve(res);
            });
          }).catch((err) => {
            reject(validationErrorToApolloUserInputError(err));
            MediaUtility.delete(media.id);
          });
        })
      });
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
