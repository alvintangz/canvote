import ApolloClient from 'apollo-boost';

const errorListeners: ((error) => void)[] = [];

function onNetworkError(listener: (error) => void) {
  errorListeners.push(listener);
}

const client = new ApolloClient({
    uri: process.env.REACT_APP_VOTING_SERVICE_BASE_URL + 'graphql',
    // onError: ({ networkError }) => {
    //     errorListeners.forEach(listener => {
    //         listener(networkError);
    //     });
    // }
});

export default client;
