import apiBase from './base';
import { UserRole } from '../enums/role';
import { AxiosResponse } from "axios";
import { User } from "../interfaces/models";

const axios = apiBase.axios.create({
  baseURL: process.env.REACT_APP_AUTH_SERVICE_BASE_URL,
  withCredentials: true
});

interface ListUsersOptions {
  first_name: string;
  last_name: string;
  email: string;
  page: number;
  size: number;
}

/**
 * Craft the users endpoint provided parameters
 * @param role - The role of the user
 * @param userId - (Optional) The user id of the user
 * @param options - (Optional) Filterable options to be added in query params
 */
const craftEndpoint = (role: UserRole.voter | UserRole.election_officer, userId?: number, options?: ListUsersOptions): string => {
  let endpoint = 'users/election-officers';
  if (role === UserRole.voter) endpoint = 'users/voters';
  if (userId) endpoint = `${endpoint}/${userId.toString()}`;
  if (options && Object.keys(options).length > 0) {
    let moreThanOneQueryParam = false;
    Object.keys(options).forEach(key => {
      if (moreThanOneQueryParam)
        endpoint += "&";
      else
        endpoint += "?";

      endpoint += `${key}=${options[key]}`;
      moreThanOneQueryParam = true;
    });
  }
  return endpoint;
};

/**
 * Lists users by role and other parameters.
 * @param role - The specific role of the user (for endpoint creation)
 * @param options - Options to filter the list
 */
function listByRoleNamePage(
  role: UserRole.voter | UserRole.election_officer,
  options: ListUsersOptions
): Promise<AxiosResponse<User[]>> {
  const endpoint = craftEndpoint(role, undefined, options);
  return axios.get(endpoint);
}

/**
 * Retrieve a user by role.
 * @param role - The specific role of the user (for endpoint creation)
 * @param userId - The user id of the user to retrieve
 */
function retrieveByRole(
    role: UserRole.voter | UserRole.election_officer,
    userId: number
): Promise<AxiosResponse<User>> {
  const endpoint = craftEndpoint(role, userId);
  return axios.get(endpoint);
}

/**
 * Create a user by role.
 * @param role - The specific role of the user (for endpoint creation)
 * @param toCreate - The user to create as a user object
 */
function createByRole(
    role: UserRole.voter | UserRole.election_officer,
    toCreate: User
): Promise<AxiosResponse<User>> {
  const endpoint = craftEndpoint(role);
  return axios.post(endpoint, toCreate);
}

/**
 * Update a user by role.
 * @param role - The specific role of the user (for endpoint creation)
 * @param userId - The user id of the user to update
 * @param toUpdate - The user object to update with
 */
function updateByRole(
    role: UserRole.voter | UserRole.election_officer,
    userId: number,
    toUpdate: User
): Promise<AxiosResponse<User>> {
  const endpoint = craftEndpoint(role, userId);
  return axios.put(endpoint, toUpdate);
}


export default { retrieveByRole, createByRole, updateByRole, listByRoleNamePage};
