import { SEARCH, SEARCH_SUCCESS, SEARCH_FAILURE } from './ActionTypes';
import axios from 'axios';

/* Search */
export function searchRequest(username) {
  return (dispatch) => {
    dispatch({ type: SEARCH });

    return axios
      .get('/users/search/' + username)
      .then((response) => {
        dispatch({ type: SEARCH_SUCCESS, payload: { data: response.data } });
      })
      .catch((error) => {
        dispatch({ type: SEARCH_FAILURE });
      });
  };
}
