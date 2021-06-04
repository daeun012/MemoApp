import authReducer from './auth-reducer';
import memoReducer from './memo-reducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth: authReducer,
  memo: memoReducer,
});
export default rootReducer;
