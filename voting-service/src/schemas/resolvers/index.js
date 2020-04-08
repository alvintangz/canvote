import { MultiPolygonObject } from 'graphql-geojson';
import DistrictResolvers from './district';
import PoliticalPartyResolvers from './politicalParty';
import PoliticalPartyCandidateResolvers from './politicalPartyCandidate';
import VoteResolver from './vote';

export default {
  District: {
    candidates: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidatesByDistrict,
  },
  PoliticalParty: {
    candidates: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidatesByPoliticalParty,
  },
  PoliticalPartyCandidate: {
    politicalParty: PoliticalPartyResolvers.getPoliticalPartyByCandidate,
    district: DistrictResolvers.getDistrictByCandidate,
  },
  Query: {
    district: DistrictResolvers.getDistrict,
    districts: DistrictResolvers.getDistricts,
    politicalParty: PoliticalPartyResolvers.getPoliticalParty,
    politicalParties: PoliticalPartyResolvers.getPoliticalParties,
    politicalPartyCandidate: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidate,
    politicalPartyCandidates: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidates,
  },
  Mutation: {
    createDistrict: DistrictResolvers.createDistrict,
    updateDistrict: DistrictResolvers.updateDistrict,
    deleteDistrict: DistrictResolvers.deleteDistrict,
    createPoliticalParty: PoliticalPartyResolvers.createPoliticalParty,
    updatePoliticalParty: PoliticalPartyResolvers.updatePoliticalParty,
    deletePoliticalParty: PoliticalPartyResolvers.deletePoliticalParty,
    createPoliticalPartyCandidate: PoliticalPartyCandidateResolvers.createPoliticalPartyCandidate,
    updatePoliticalPartyCandidate: PoliticalPartyCandidateResolvers.updatePoliticalPartyCandidate,
    deletePoliticalPartyCandidate: PoliticalPartyCandidateResolvers.deletePoliticalPartyCandidate,
    vote: VoteResolver.vote,
  },
  GeoJSONMultiPolygon: MultiPolygonObject,
};
