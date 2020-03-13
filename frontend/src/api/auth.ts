import apiBase from './base';
import services from '../services';
import {AxiosResponse} from "axios";
import {AuthFactorResponse} from "../interfaces/auth-factor-response";

const axios = apiBase.axios.create({
  baseURL: services.auth.baseUrl,
});

function loginFirst(email: string, password: string): Promise<AxiosResponse<AuthFactorResponse>> {
  return axios.post('Login/login/first', { email, password });
}

function logout(): any {
  return axios.post('Login/logout');
}

export default { loginFirst, logout };
