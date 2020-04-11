import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from "apollo-link-error";
import {GraphQLError} from "graphql";


const unAuthErrorListeners: ((error: GraphQLError) => void)[] = [];

/**
 * Subscribe to any GraphQLError with UNAUTHENTICATED error code.
 * @param listener - listener listening for UNAUTHENTICATED error code
 */
export function onUnauthenticatedError(listener: (error: GraphQLError) => void) {
    unAuthErrorListeners.push(listener);
}

const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        // Loop through each error and if there's any unauthenticated error, let listeners know
        graphQLErrors.forEach((error: GraphQLError) => {
            if (error.extensions && error.extensions.code === "UNAUTHENTICATED") {
                unAuthErrorListeners.forEach(listener => listener(error));
            }
        });
    }
});

// Using this link enables file uploads through Apollo client - multipart/form-data
const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_VOTING_SERVICE_BASE_URL + '/graphql',
    // TODO: Check this for security
    credentials: 'include', // Include credentials for cross-origin calls
});

const client = new ApolloClient({
    link: errorLink.concat(uploadLink),
    cache: new InMemoryCache(),
});

export default client;
