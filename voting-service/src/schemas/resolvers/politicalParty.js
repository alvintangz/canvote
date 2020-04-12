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
import PoliticalPartyCandidate from '../../models/politicalPartyCandidate';

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
        // Upload media and get its db instance back
        MediaUtility.upload(file).then((media) => {
          const politicalParty = new PoliticalParty({
            name: sanitizeHTML(args.name), // Sanitize
            colour: sanitizeHTML(args.colour), // Sanitize
            logo: media
          });

          // Validate the schema
          politicalParty.validate().then(() => {
            politicalParty.save((err, res) => {
              // Delete the uploaded image if error occurs
              if (rejectErrorIfNeeded(err, reject)) return MediaUtility.delete(media.id);
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
      const findOneAndUpdate = (args, media = null) => {
        // Update object as needed (like a PATCH instead of PUT in REST)
        let toSave = {};
        if (args.name) Object.assign(toSave, { name: sanitizeHTML(args.name) });
        if (args.colour) Object.assign(toSave, { colour: sanitizeHTML(args.colour) });
        if (media) Object.assign(toSave, { picture: media });

        return PoliticalParty.findOneAndUpdate({ _id: args.id }, {
          $set: toSave
        }, {
          new: true,
          runValidators: true,
        }).populate('logo').exec((err, res) => {
          if (rejectErrorIfNeeded(err, reject)) {
            if (media) MediaUtility.delete(media.id);
            return;
          }
          if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
          resolve(res);
        });
      };

      if (args.picture) {
        args.picture.then(file => {
          MediaUtility.upload(file).then((media) => {
            findOneAndUpdate(args, media);
          });
        });
      } else {
        findOneAndUpdate(args);
      }
    })
  ))),
  deletePoliticalParty: combineResolvers(isAdministrator, ((parent, args) => (
    new Promise((resolve, reject) => {
      // Delete all candidates in the political party
      PoliticalPartyCandidate.remove({ political_party: args.id }, (err) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        PoliticalParty.findByIdAndRemove({ _id: args.id }, (err, res) => {
          if (rejectErrorIfNeeded(err, reject)) return;
          if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
          resolve(res);
        });
      });
    })
  ))),
};
