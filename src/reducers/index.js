import userReducer from './user-reducer';
import memoReducer from './memo-reducer';
import searchReducer from './search-reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  user: userReducer,
  memo: memoReducer,
  search: searchReducer,
});
export default rootReducer;
