import apiBase from './base';
import { UserRole } from '../enums/role';
import { AxiosResponse } from "axios";
import { User } from "../interfaces/user";

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

const craftEndpoint = (role: UserRole.voter | UserRole.election_officer, userId?: number, options?: ListUsersOptions): string => {
  let endpoint = 'users/election-officers';
  if (role === UserRole.voter) endpoint = 'users/voters';
  if (userId) endpoint = `${endpoint}/${userId.toString()}`;
  if (options && Object.keys(options).length > 0) {
    let moreThanOneQueryParam = false;
    Object.keys(options).forEach(key => {
      if (moreThanOneQueryParam)
        endpoint += "&"
      else
        endpoint += "?"

      endpoint += `${key}=${options[key]}`;
      moreThanOneQueryParam = true;
    });
  }
  return endpoint;
};

function listByRoleNamePage(
  role: UserRole.voter | UserRole.election_officer,
  options: ListUsersOptions
): Promise<AxiosResponse<User[]>> {
  const endpoint = craftEndpoint(role, undefined, options);
  return axios.get(endpoint);
}

function retrieveByRole(
    role: UserRole.voter | UserRole.election_officer,
    userId: number
): Promise<AxiosResponse<User>> {
  const endpoint = craftEndpoint(role, userId);
  return axios.get(endpoint);
}

function createByRole(
    role: UserRole.voter | UserRole.election_officer,
    toCreate: User
): Promise<AxiosResponse<User>> {
  const endpoint = craftEndpoint(role);
  return axios.post(endpoint, toCreate);
}

function updateByRole(
    role: UserRole.voter | UserRole.election_officer,
    userId: number,
    toUpdate: User
): Promise<AxiosResponse<User>> {
  const endpoint = craftEndpoint(role, userId);
  return axios.put(endpoint, toUpdate);
}

export default { retrieveByRole, createByRole, updateByRole, listByRoleNamePage};
