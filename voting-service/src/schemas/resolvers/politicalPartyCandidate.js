import { combineResolvers } from 'graphql-resolvers';
import { isAdministrator } from './auth';
import { PoliticalPartyCandidate, PoliticalParty, District, BallotCount } from '../../models';
import {
  rejectErrorIfNeeded,
  rejectNotFoundIfNeeded,
  validationErrorToApolloUserInputError
} from './helpers';
import { MediaUtility } from '../../models/media';
import { ValidationError } from 'apollo-server-express';
import sanitizeHTML from 'sanitize-html';

export default {
  getPoliticalPartyCandidates: () => PoliticalPartyCandidate.find({}).populate('picture').exec(),
  getPoliticalPartyCandidate: (parent, args) => new Promise((resolve, reject) => {
    PoliticalPartyCandidate.findById(args.id).populate('picture').exec((err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  }),
  getPoliticalPartyCandidatesByDistrict: (district) => new Promise(((resolve, reject) => (
    PoliticalPartyCandidate.find({ district: district._id }).populate('picture').exec((err, res) => {
      if (rejectErrorIfNeeded(err, reject)) return;
      if (rejectNotFoundIfNeeded(res, reject, 'Political Party Candidate', district.id)) return;
      resolve(res);
    })
  ))),
  getPoliticalPartyCandidatesByPoliticalParty: (politicalParty) => (
    new Promise(((resolve, reject) => (
      PoliticalPartyCandidate.find({ political_party: politicalParty._id }, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'Political Party Candidate', politicalParty.id)) return;
        resolve(res);
      })
    )))
  ),
  createPoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args, context) => (
    new Promise((resolve, reject) => {
      return args.picture.then(file => {
        // Upload media and get its db instance back
        MediaUtility.upload(file).then((media) => {
          const politicalPartyCandidate = new PoliticalPartyCandidate({
            name: sanitizeHTML(args.name), // Sanitize
            political_party: args.political_party,
            district: args.district,
            picture: media
          });

          // Validate the schema
          politicalPartyCandidate.validate().then(() => {
            // Validate the political party exists
            PoliticalParty.findById(args.political_party, (err, politicalParty) => {
              // Delete the uploaded image if validation failed or error occurs
              if (rejectErrorIfNeeded(err, reject)) return MediaUtility.delete(media.id);
              if (!politicalParty) {
                MediaUtility.delete(media.id);
                return reject(new ValidationError(`Political party with id "${args.politicalParty}" does not exist.`));
              }

              // Validate the district exists
              District.findById(args.district, (err, district) => {
                // Delete the uploaded image if validation failed or error occurs
                if (rejectErrorIfNeeded(err, reject)) return MediaUtility.delete(media.id);
                if (!district) {
                  MediaUtility.delete(media.id);
                  return reject(new ValidationError(`District with id "${args.district}" does not exist.`));
                }

                // Finally save
                politicalPartyCandidate.save((err, candidate) => {
                  // Delete the uploaded image if error occurs
                  if (rejectErrorIfNeeded(err, reject)) return MediaUtility.delete(media.id);
                  resolve(candidate);
                });
              });
            });
          }).catch((err) => {
            reject(validationErrorToApolloUserInputError(err));
            MediaUtility.delete(media.id);
          });
        });
      });
    }
  ))),
  updatePoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args, context) => (
    new Promise((resolve, reject) => {
      const findOneAndUpdate = (args, media) => {
        // Update object as needed (like a PATCH instead of PUT in REST)
        let toSave = {};
        if (args.political_party) Object.assign(toSave, { political_party: args.political_party });
        if (args.district) Object.assign(toSave, { district: args.district });
        if (args.name) Object.assign(toSave, { name: sanitizeHTML(args.name) });
        if (media) Object.assign(toSave, { picture: media });

        return PoliticalPartyCandidate.findOneAndUpdate({ _id: args.id }, {
          $set: toSave
        }, {
          new: true,
          runValidators: true,
        }).populate('picture').exec((err, res) => {
          if (rejectErrorIfNeeded(err, reject)) {
            if (media) MediaUtility.delete(media.id);
            return;
          }
          if (rejectNotFoundIfNeeded(res, reject, 'Candidate', args.id)) return;
          resolve(res);
        });
      };

      const validateAndUpdate = (args, media = null) => {
        // If the political party is in args
        if (args.political_party) {
          // Validate the political party exists
          PoliticalParty.findById(args.political_party, (err, politicalParty) => {
            // Delete the uploaded image if validation failed or error occurs
            if (rejectErrorIfNeeded(err, reject)) {
              if (media) MediaUtility.delete(media.id);
              return;
            }
            if (!politicalParty) {
              if (media) MediaUtility.delete(media.id);
              return reject(new ValidationError(`Political party with id "${args.politicalParty}" does not exist.`));
            }

            // If the district is in args
            if (args.district) {
              // Validate the district exists
              District.findById(args.district, (err, district) => {
                // Delete the uploaded image if validation failed or error occurs
                if (rejectErrorIfNeeded(err, reject)) {
                  if (media) MediaUtility.delete(media.id);
                  return;
                }
                if (!district) {
                  if (media) MediaUtility.delete(media.id);
                  return reject(new ValidationError(`District with id "${args.district}" does not exist.`));
                }

                // Finally save
                findOneAndUpdate(args, media);
              });
            } else {
              findOneAndUpdate(args, media);
            }
          });
        } else {
          // If the district is in args
          if (args.district) {
            // Validate the district exists
            District.findById(args.district, (err, district) => {
              // Delete the uploaded image if validation failed or error occurs
              if (rejectErrorIfNeeded(err, reject)) {
                if (media) MediaUtility.delete(media.id);
                return;
              }
              if (!district) {
                if (media) MediaUtility.delete(media.id);
                return reject(new ValidationError(`District with id "${args.district}" does not exist.`));
              }

              // Finally save
              findOneAndUpdate(args, media);
            });
          } else {
            findOneAndUpdate(args, media);
          }
        }
      };

      if (args.picture) {
        args.picture.then(file => {
          MediaUtility.upload(file).then((media) => {
            validateAndUpdate(args, media);
          });
        });
      } else {
        validateAndUpdate(args);
      }
    })
  )),
  deletePoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      // Ensure that it can't be deleted when there's at least one vote for this candidate
      BallotCount.countDocuments({ candidate: args.id }, (err, count) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (count > 0) return reject(new Error("Cannot delete candidate as votes cannot be invalidated."));
        PoliticalPartyCandidate.findByIdAndRemove({ _id: args.id }, (err, res) => {
          if (rejectErrorIfNeeded(err, reject)) return;
          if (rejectNotFoundIfNeeded(res, reject, 'Political Party', args.id)) return;
          MediaUtility.delete(res.picture._id);
          resolve(res);
        });
      });
    })
  )),
};
