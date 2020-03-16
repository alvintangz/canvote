import { createStore } from 'redux';
import reducers from './reducers';
import createBrowserHistory from 'history/createBrowserHistory';

export const history = createBrowserHistory();

export const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // TODO: Remove
);
