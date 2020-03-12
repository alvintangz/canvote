import apiBase from './base';
import services from '../services';
import { UserRole } from '../enums/role';
import { AxiosResponse } from "axios";
import { User } from "../interfaces/user";

const axios = apiBase.axios.create({
  baseURL: services.auth.baseUrl,
});

const craftEndpoint = (role: UserRole.voter | UserRole.election_officer, userId?: number): string => {
  let endpoint = 'users/election-officers';
  if (role === UserRole.voter) endpoint = 'users/voters';
  if (userId) endpoint = `${endpoint}/${userId.toString()}`;
  return endpoint;
};

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

export default { retrieveByRole, createByRole, updateByRole };
