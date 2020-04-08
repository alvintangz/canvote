import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) => (
  me ? skip : new AuthenticationError('The user must be authenticated.'));

export const isVoter = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => (
    role === 'VOTER' ? skip : new ForbiddenError('The user must be authorized as a voter.')
  ),
);

// export const isElectionOfficer = combineResolvers(
//   isAuthenticated,
//   (parent, args, { user: { role } }) => (
//     role === 'election_officer' ? skip
//       : new ForbiddenError('The user must be authorized as an election officer.')
//   ),
// );

export const isAdministrator = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => (
    role === 'administrator' ? skip
      : new ForbiddenError('The user must be authorized as an administrator.')
  ),
);
