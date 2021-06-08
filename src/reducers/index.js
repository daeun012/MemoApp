import userReducer from './user-reducer';
import memoReducer from './memo-reducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  user: userReducer,
  memo: memoReducer,
});
export default rootReducer;
