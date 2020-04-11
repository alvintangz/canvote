import httpRequests from './base';
import { AxiosResponse } from "axios";
import { User } from "../interfaces/models";

const axios = httpRequests.axios.create({
    baseURL: process.env.REACT_APP_AUTH_SERVICE_BASE_URL,
    withCredentials: true
});

/**
 * Retrieve the current authenticated user.
 */
function retrieve(): Promise<AxiosResponse<User>> {
    return axios.get('users/me');
}

/**
 * Resets a password.
 * @param passwordOne - First password
 * @param passwordTwo - Second password to compare first password to
 */
function resetPassword(
    passwordOne: string,
    passwordTwo: string
): Promise<AxiosResponse<User>> {
    if (passwordOne !== passwordTwo) throw new Error('Passwords don\'t match');

    return axios.post(
        'users/me/reset-password',
        `"${passwordOne}"`,
        { headers: { 'Content-Type': 'application/json' } }
    );
}

/**
 * Activates the account of a user.
 * @param token - Token for account verification
 * @param passwordOne - First password
 * @param passwordTwo - Second password to compare first password to
 */
function activateAccount(
    token: string,
    passwordOne: string,
    passwordTwo: string,
): Promise<AxiosResponse<User>> {
    if (passwordOne !== passwordTwo) throw new Error('Passwords don\'t match');

    return axios.post('users/me/activate-account', { token, password: passwordOne });
}

export default { retrieve, resetPassword, activateAccount };
