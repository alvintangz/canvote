import { gql } from 'apollo-server-express';
import district from './district.graphql';
import politicalParty from './politicalParty.graphql';
import politicalPartyCandidate from './politicalPartyCandidate.graphql';
import vote from './vote.graphql';
import file from './media.graphql';
import voter from './voter.graphql';

const root = gql`
  scalar Upload
  scalar GeoJSONMultiPolygon

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [
  root,
  district,
  politicalParty,
  politicalPartyCandidate,
  vote,
  file,
  voter,
];
