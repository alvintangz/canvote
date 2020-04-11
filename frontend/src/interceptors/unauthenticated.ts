import authApi from "../api/auth";
import baseApi from "../api/base";
import {onUnauthenticatedError} from "../api/apolloClient";

export default (): void => {
    const unauthenticatedAction = (): void => {
        // Log user out (clear cookie)
        authApi.logout().finally(() => {
            // No matter what, redirect user to login page
            // Note: Cannot use react router to redirect b/c cannot use withRouter outside of Router but can use state
            // and push redirection via Redirect component but it gets messy, this is the only time breaking off the
            // rules for SPA and history change
            window.location.replace('/auth/login?denied=1');
        });
    };

    // When the authentication service gives a 401 unauthenticated code, execute action to log user out
    baseApi.onError(error => { if (error.code === "401") unauthenticatedAction() });
    // When the GraphQL voting service gives an unauthenticated error, execute action to log user out
    onUnauthenticatedError(() => unauthenticatedAction());
};
