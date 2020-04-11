import { combineResolvers } from 'graphql-resolvers';
import { isAdministrator } from './auth';
import { PoliticalPartyCandidate, PoliticalParty, District } from '../../models';
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
      PoliticalPartyCandidate.find({ politicalParty: politicalParty._id }, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'Political Party Candidate', politicalParty.id)) return;
        resolve(res);
      })
    )))
  ),
  createPoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args, context) => (
    new Promise((resolve, reject) => {
      return args.picture.then(file => {
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
  updatePPCandidate: combineResolvers(isAdministrator, (parent, args, context) => (
    new Promise((resolve, reject) => {
      const update = (media = null) => {

      };

      if (args.picture) {
        args.picture.then(file => {
          MediaUtility.upload(file).then((media) => {

          })
        })
      } else {

      }
    })
  )),
  updatePoliticalPartyCandidate: combineResolvers(isAdministrator, (parent, args, context) => {

    // PoliticalPartyResolver.default.Query.politicalParty(
    //   null, { name: args.political_party }, context
    // ).then(() => {
    //   DistrictResolver.default.Query.district(null, { name: args.district }, context)
    //     .then(
    //       PoliticalPartyCandidate.findOneAndUpdate(
    //         { _id: args.id },
    //         {
    //           $set: {
    //             name: args.name,
    //             political_party: args.political_party,
    //             district: args.district
    //           },
    //         }, { new: true },
    //         (err, res) => {
    //           if (err) return reject(err);
    //           return resolve(res);
    //         },
    //       ),
    //     )
    //     .catch(() => {
    //       throw new Error('The district does not exist');
    //     });
    // }).catch(() => {
    //   throw new Error('The political party does not exist');
    // });
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
