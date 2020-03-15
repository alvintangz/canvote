import apiBase from './base';
import {AxiosResponse} from "axios";
import {AuthFactorResponse} from "../interfaces/responses/auth-factor-response";

const axios = apiBase.axios.create({
  baseURL: process.env.REACT_APP_AUTH_SERVICE_BASE_URL,
  withCredentials: true
});

function loginFirst(email: string, password: string): Promise<AxiosResponse<AuthFactorResponse>> {
  return axios.post('auth/login/first', { email, password });
}

function logout(): Promise<AxiosResponse> {
  return axios.post('auth/logout');
}

export default { loginFirst, logout };
