import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  usernames: [],
};

export default function search(state = initialState, { type, payload }) {
  switch (type) {
    case types.SEARCH:
      return update(state, {
        status: { $set: 'WAITING' },
      });
    case types.SEARCH_SUCCESS:
      return update(state, {
        status: { $set: 'SUCCESS' },
        usernames: { $set: payload.data },
      });
    case types.SEARCH_FAILURE:
      return update(state, {
        status: { $set: 'FAILURE' },
        usernames: { $set: '' },
      });
    default:
      return state;
  }
}
