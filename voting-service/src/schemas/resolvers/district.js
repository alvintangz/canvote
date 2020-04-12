import { combineResolvers } from 'graphql-resolvers';
import GeoJsonValidation from 'geojson-validation';
import { ValidationError } from 'apollo-server-express';
import { isAdministrator } from './auth';
import { District, PoliticalPartyCandidate, Voter } from '../../models';
import {
  rejectErrorIfNeeded,
  rejectNotFoundIfNeeded,
  validationErrorToApolloUserInputError,
} from './helpers';
import sanitizeHTML from 'sanitize-html';

const validateJSON = (json) => {
  try {
    JSON.parse(json)
  } catch(e) {
    return e;
  }
  return null;
};

export default {
  getDistricts: () => District.find({}),
  getDistrict: (parent, args) => (
    new Promise((resolve, reject) => (
      District.findById(args.id, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'District', args.id)) return;
        resolve(res);
      })
    ))
  ),
  getDistrictByCandidate: (candidate) => (
    new Promise(((resolve, reject) => (
      District.findById(candidate.district, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'District', candidate.district)) return;
        resolve(res);
      })
    )))
  ),
  getDistrictByVoter: (voter) => (
    new Promise(((resolve, reject) => (
      District.findById(voter.district, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'District', voter.district)) return;
        resolve(res);
      })
    )))
  ),
  createDistrict: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      if (validateJSON(args.geoJson)) return reject(new ValidationError(`GeoJSON not valid: ${validateJSON(args.geoJson)}`));
      GeoJsonValidation.isMultiPolygon(JSON.parse(args.geoJson), (valid, geoJsonErrs) => {
        if (!valid) return reject(new ValidationError(`GeoJSON not valid: ${geoJsonErrs.join('; ')}`));
        const district = new District({
          name: sanitizeHTML(args.name), // Sanitize
          geoJson: JSON.parse(args.geoJson),
        });

        return district.validate().then(() => {
          district.save((err, res) => {
            if (rejectErrorIfNeeded(err, reject)) return;
            resolve(res);
          });
        }).catch((err) => reject(validationErrorToApolloUserInputError(err)));
      });
    })
  )),
  updateDistrict: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      if (validateJSON(args.geoJson)) return reject(new ValidationError(`GeoJSON not valid: ${validateJSON(args.geoJson)}`));
      GeoJsonValidation.isMultiPolygon(JSON.parse(args.geoJson), (valid, geoJsonErrs) => {
        if (!valid) return reject(new ValidationError(`GeoJSON not valid: ${geoJsonErrs.join('; ')}`));
        return District.findOneAndUpdate({ _id: args.id }, {
          $set: {
            name: sanitizeHTML(args.name), // Sanitize
            geoJson: JSON.parse(args.geoJson),
          },
        }, {
          new: true,
          runValidators: true,
        }, (err, res) => {
          if (rejectErrorIfNeeded(err, reject)) return;
          if (rejectNotFoundIfNeeded(res, reject, 'District', args.id)) return;
          resolve(res);
        });
      });
    })
  )),
  deleteDistrict: combineResolvers(isAdministrator, (parent, args) => (
    new Promise((resolve, reject) => {
      District.findByIdAndRemove(args.id, (err, res) => {
        if (rejectErrorIfNeeded(err, reject)) return;
        if (rejectNotFoundIfNeeded(res, reject, 'District', args.id)) return;
        // Delete all candidates in a district
        PoliticalPartyCandidate.remove({ district: args.id }).exec((err) => {
          if (rejectErrorIfNeeded(err, reject)) return;
          // Reset all voters in that district
          Voter.remove({ district: args.id }).exec((err) => {
            if (rejectErrorIfNeeded(err, reject)) return;
            resolve(res);
          });
        });
      });
    })
  )),
};
