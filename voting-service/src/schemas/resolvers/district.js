import { combineResolvers } from 'graphql-resolvers';
import GeoJsonValidation from 'geojson-validation';
import { ValidationError } from 'apollo-server-express';
import { isAdministrator } from './auth';
import { District } from '../../models';
import {
  rejectErrorIfNeeded,
  rejectNotFoundIfNeeded,
  validationErrorToApolloUserInputError,
} from './helpers';

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
  createDistrict: combineResolvers((parent, args) => (
    new Promise((resolve, reject) => {
      GeoJsonValidation.isPolygon(JSON.parse(args.geoJson), (valid, geoJsonErrs) => {
        if (!valid) return reject(new ValidationError(`GeoJSON not valid: ${geoJsonErrs.join('; ')}`));
        const district = new District({
          name: args.name,
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
      GeoJsonValidation.isPolygon(JSON.parse(args.geoJson), (valid, geoJsonErrs) => {
        if (!valid) return reject(new ValidationError(`GeoJSON not valid: ${geoJsonErrs.join('; ')}`));
        return District.findOneAndUpdate(args.id, {
          $set: {
            name: args.name,
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
        resolve(res);
      });
    })
  )),
};
