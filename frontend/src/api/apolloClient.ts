import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError as apolloOnError } from 'apollo-link-error';

const httpLink = new HttpLink({
    uri: process.env.REACT_APP_VOTING_SERVICE_BASE_URL + 'graphql',
    credentials: 'include',
});

const errorListeners: ((error) => void)[] = [];

function onNetworkError(listener: (error) => void) {
  errorListeners.push(listener);
}

const onErrorLink = apolloOnError(({ networkError }) => {
    errorListeners.forEach(listener => {
        listener(networkError);
    });
});

const client = new ApolloClient({
    link: onErrorLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
