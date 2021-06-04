import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_REGISTER,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_LOGOUT,
  AUTH_GET_STATUS,
  AUTH_GET_STATUS_SUCCESS,
  AUTH_GET_STATUS_FAILURE,
} from './ActionTypes';
import axios from 'axios';

/* LOGIN */
export function loginRequest(username, password) {
  return (dispatch) => {
    dispatch({ type: AUTH_LOGIN });
    return axios
      .post('/api/account/signin', { username: username, password: password })
      .then((response) => {
        dispatch({ type: AUTH_LOGIN_SUCCESS, payload: username });
      })
      .catch((error) => {
        dispatch({ type: AUTH_LOGIN_FAILURE });
      });
  };
}

/* REGISTER */
export function registerRequest(username, password) {
  return (dispatch) => {
    dispatch({ type: AUTH_REGISTER });
    return axios
      .post('/api/account/signup', { username, password })
      .then((response) => {
        dispatch({ type: AUTH_REGISTER_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: AUTH_REGISTER_FAILURE, payload: error.response.data.code });
      });
  };
}

/* Logout */
export function logoutRequest() {
  return (dispatch) => {
    return axios.post('/api/account/logout').then((response) => {
      dispatch({ type: AUTH_LOGOUT });
    });
  };
}

/* GET STATUS */
export function getStatusRequest() {
  return (dispatch) => {
    dispatch({ type: AUTH_GET_STATUS });
    return axios
      .get('/api/account/getInfo')
      .then((response) => {
        dispatch({ type: AUTH_GET_STATUS_SUCCESS, payload: username });
      })
      .catch((error) => {
        dispatch({ type: AUTH_GET_STATUS_FAILURE });
      });
  };
}
