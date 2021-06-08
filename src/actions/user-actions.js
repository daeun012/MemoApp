import {
  USER_LOGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_REGISTER,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAILURE,
  USER_LOGOUT,
  USER_GET_STATUS,
  USER_GET_STATUS_SUCCESS,
  USER_GET_STATUS_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/* LOGIN */
export function loginRequest(username, password) {
  return (dispatch) => {
    dispatch({ type: USER_LOGIN });
    return axios
      .post('/users/login', { username: username, password: password })
      .then((response) => {
        dispatch({ type: USER_LOGIN_SUCCESS, payload: { username } });
      })
      .catch((error) => {
        dispatch({ type: USER_LOGIN_FAILURE });
      });
  };
}

/* REGISTER */
export function registerRequest(username, password) {
  return (dispatch) => {
    dispatch({ type: USER_REGISTER });
    return axios
      .post('/users/register', { username, password })
      .then((response) => {
        dispatch({ type: USER_REGISTER_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: USER_REGISTER_FAILURE, payload: { error: error.response.data.code } });
      });
  };
}

/* Logout */
export function logoutRequest() {
  return (dispatch) => {
    return axios.post('/users/logout').then((response) => {
      dispatch({ type: USER_LOGOUT });
    });
  };
}

/* GET STATUS */
export function getStatusRequest() {
  return (dispatch) => {
    dispatch({ type: USER_GET_STATUS });
    return axios
      .get('/users/getInfo')
      .then((response) => {
        dispatch({ type: USER_GET_STATUS_SUCCESS, payload: { username: response.data.info.username } });
      })
      .catch((error) => {
        dispatch({ type: USER_GET_STATUS_FAILURE });
      });
  };
}
