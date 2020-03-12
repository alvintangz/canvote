import httpRequests from './base';
import services from '../services';
import { AxiosResponse } from "axios";
import { User } from "../interfaces/user";

const axios = httpRequests.axios.create({
    baseURL: services.auth.baseUrl,
});

function retrieve(): Promise<AxiosResponse<User>> {
    return axios.get('users/me');
}

function resetPassword(
    passwordOne: string,
    passwordTwo: string
): Promise<AxiosResponse<User>> {
    if (passwordOne !== passwordTwo) throw new Error('Passwords don\'t match');

    return axios.post('users/me/reset-password', passwordOne);
}

function activateAccount(
    token: string,
    passwordOne,
    passwordTwo,
): Promise<AxiosResponse<User>> {
    if (passwordOne !== passwordTwo) throw new Error('Passwords don\'t match');

    return axios.post('users/me/activate-account', { token, password: passwordOne });
}

export default { retrieve, resetPassword, activateAccount };
