import { AuthActionType } from '../enums/actions/auth.types';

const unauthenticatedState = {
    loggedIn: false,
    user: null
};

export default (state = unauthenticatedState, action) => {
    switch(action.type) {
        case AuthActionType.LOGIN_SUCCESS:
        case AuthActionType.USER_AUTHENTICATED_FROM_CHECK:
            return {
                loggedIn: true,
                user: action.user
            };
        case AuthActionType.LOGOUT_SUCCESS:
        case AuthActionType.INVALID_AUTH:
            return unauthenticatedState;
        default:
            return state;
    }
}
