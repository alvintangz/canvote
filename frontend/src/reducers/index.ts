import { combineReducers } from 'redux';
import authReducer from './auth';

export default combineReducers({
    authReducer // For CanVote, only one reducer is used for authentication but more can be added
});
