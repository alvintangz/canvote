import { AuthActionType } from '../enums/actions/auth.types';
import {User} from "../interfaces/models";

interface AuthState {
    // Whether or not user is logged in.
    loggedIn: boolean;
    // User that is logged in. Should be null if !loggedIn.
    user: User | null;
}

const unauthenticatedState: AuthState = {
    loggedIn: false,
    user: null
};

export default (state: AuthState = unauthenticatedState, action): AuthState => {
    switch(action.type) {
        case AuthActionType.LOGIN_SUCCESS:
        case AuthActionType.USER_AUTHENTICATED_FROM_CHECK:
            return {
                loggedIn: true,
                user: action.user
            } as AuthState;
        case AuthActionType.LOGOUT_SUCCESS:
        case AuthActionType.LOGOUT_FOR_USER:
            return unauthenticatedState;
        default:
            return state;
    }
}
