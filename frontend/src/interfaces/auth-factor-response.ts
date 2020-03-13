import {AuthFactor} from "../enums/auth-factor";

export interface AuthFactorResponse {
    loggedIn: boolean,
    nextUrl: string,
    nextFactor: AuthFactor
}
