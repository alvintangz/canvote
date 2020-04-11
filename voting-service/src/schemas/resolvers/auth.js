import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { combineResolvers, skip } from 'graphql-resolvers';
import axios from 'axios';
import { AUTH_SERVICE_BASE_URL } from '../../config';

/**
 * Resolver to be used to check if user is authenticated. If user is not, throw auth error.
 */
export const isAuthenticated = (parent, args, { me }) => (
  me ? skip : new AuthenticationError('The user must be authenticated.'));

/**
 * Resolver to be used to check if user is authenticated, by checking with the authentication
 * server. If they are not, throw authentication error.
 */
export const hardVerify = combineResolvers(
  isAuthenticated,
  (parent, args, { jwt }) => (
    axios.post(`${AUTH_SERVICE_BASE_URL}/auth/verify`, `"${jwt}"`).then(() => skip).catch(
      () => new AuthenticationError("The user's token is not valid."))
  ),
);

/**
 * Resolver to be used to check if user is a voter. If they are not, throw forbidden error.
 */
export const isVoter = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => (
    role === 'voter' ? skip : new ForbiddenError('The user must be authorized as a voter.')
  ),
);

/**
 * Resolver to be used to check if user is a election officer. If they are not, throw forbidden
 * error.
 */
export const isElectionOfficer = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => (
    role === 'election_officer' ? skip
      : new ForbiddenError('The user must be authorized as an election officer.')
  ),
);

/**
 * Resolver to be used to check if user is an administrator. If they are not, throw forbidden
 * error.
 */
export const isAdministrator = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => (
    role === 'administrator' ? skip
      : new ForbiddenError('The user must be authorized as an administrator.')
  ),
);
