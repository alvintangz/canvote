import { MultiPolygonObject } from 'graphql-geojson';
import DistrictResolvers from './district';
import PoliticalPartyResolvers from './politicalParty';
import PoliticalPartyCandidateResolvers from './politicalPartyCandidate';
import VoterResolvers from './voter';
import VoteResolvers from './vote';

const buildMediaFileObj = (media) => ({
  filename: media.filename,
  mimetype: media.mimetype,
  location: `/media/${media._id}`
});

export default {
  District: {
    candidates: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidatesByDistrict,
  },
  PoliticalParty: {
    candidates: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidatesByPoliticalParty,
    logo: ({ logo }) => new Promise ((resolve) => resolve(buildMediaFileObj(logo))),
  },
  PoliticalPartyCandidate: {
    politicalParty: PoliticalPartyResolvers.getPoliticalPartyByCandidate,
    district: DistrictResolvers.getDistrictByCandidate,
    picture: ({ picture }) => new Promise ((resolve) => resolve(buildMediaFileObj(picture))),
  },
  Voter: {
    district: DistrictResolvers.getDistrictByVoter,
  },
  Query: {
    district: DistrictResolvers.getDistrict,
    districts: DistrictResolvers.getDistricts,
    politicalParty: PoliticalPartyResolvers.getPoliticalParty,
    politicalParties: PoliticalPartyResolvers.getPoliticalParties,
    politicalPartyCandidate: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidate,
    politicalPartyCandidates: PoliticalPartyCandidateResolvers.getPoliticalPartyCandidates,
    meAsVoter: VoterResolvers.meAsVoter,
    voter: VoterResolvers.getVoter,
    canVote: VoteResolvers.canVote,
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
    vote: VoteResolvers.vote,
    updateVoter: VoterResolvers.updateVoter,
  },
  GeoJSONMultiPolygon: MultiPolygonObject,
};
