import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  login: {
    status: 'INIT',
  },
  register: {
    status: 'INIT',
    error: -1,
  },
  status: {
    valid: false,
    isLoggedIn: false,
    currentUser: '',
  },
};

export default function user(state = initialState, { type, payload }) {
  switch (type) {
    /* LOGIN */
    case types.USER_LOGIN:
      return update(state, {
        login: {
          status: { $set: 'WAITING' },
        },
      });
    case types.USER_LOGIN_SUCCESS:
      console.log(payload);
      return update(state, {
        login: {
          status: { $set: 'SUCCESS' },
        },
        status: {
          isLoggedIn: { $set: true },
          currentUser: { $set: payload.username },
        },
      });
    case types.USER_LOGIN_FAILURE:
      return update(state, {
        login: {
          status: { $set: 'FAILURE' },
        },
      });
    case types.USER_REGISTER:
      return update(state, {
        register: {
          status: { $set: 'WAITING' },
          error: { $set: -1 },
        },
      });
    case types.USER_REGISTER_SUCCESS:
      return update(state, {
        register: {
          status: { $set: 'SUCCESS' },
        },
      });
    case types.USER_REGISTER_FAILURE:
      return update(state, {
        register: {
          status: { $set: 'FAILURE' },
          error: { $set: payload.error },
        },
      });
    case types.USER_LOGOUT:
      return update(state, {
        status: {
          isLoggedIn: { $set: false },
          currentUser: { $set: '' },
        },
      });
    case types.USER_GET_STATUS:
      return update(state, {
        status: {
          isLoggedIn: { $set: true },
        },
      });
    case types.USER_GET_STATUS_SUCCESS:
      return update(state, {
        status: {
          valid: { $set: true },
          currentUser: { $set: payload.username },
        },
      });
    case types.USER_GET_STATUS_FAILURE:
      return update(state, {
        status: {
          valid: { $set: false },
          isLoggedIn: { $set: false },
        },
      });
    default:
      return state;
  }
}
