import {
  MEMO_POST,
  MEMO_POST_SUCCESS,
  MEMO_POST_FAILURE,
  MEMO_LIST,
  MEMO_LIST_SUCCESS,
  MEMO_LIST_FAILURE,
  MEMO_EDIT,
  MEMO_EDIT_SUCCESS,
  MEMO_EDIT_FAILURE,
  MEMO_REMOVE,
  MEMO_REMOVE_SUCCESS,
  MEMO_REMOVE_FAILURE,
  MEMO_STAR,
  MEMO_STAR_SUCCESS,
  MEMO_STAR_FAILURE,
} from './ActionTypes';
import axios from 'axios';

/* MEMO POST */
export function memoPostRequest(contents) {
  return (dispatch) => {
    dispatch({ type: MEMO_POST });
    return axios
      .post('/memo/write/', { contents })
      .then((response) => {
        dispatch({ type: MEMO_POST_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: MEMO_POST_FAILURE, payload: { error: error.response.data.code } });
      });
  };
}

/* MEMO LIST */

/*
    Parameter:
        - isInitial: whether it is for initial loading
        - listType:  OPTIONAL; loading 'old' memo or 'new' memo
        - id:        OPTIONAL; memo id (one at the bottom or one at the top)
        - username:  OPTIONAL; find memos of following user
*/

export function memoListRequest(isInitial, listType, id, username) {
  return (dispatch) => {
    dispatch({ type: MEMO_LIST });
    let url = `/memo/read`;

    if (typeof username === 'undefined') {
      // username not given, load public memo
      url = isInitial ? url : `${url}/${listType}/${id}`;
    } else {
      url = isInitial ? `${url}/${username}` : `${url}/${username}/${listType}/${id}`;
    }

    return axios
      .get(url)
      .then((response) => {
        dispatch({ type: MEMO_LIST_SUCCESS, payload: { data: response.data, isInitial, listType } });
      })
      .catch((error) => {
        dispatch({ type: MEMO_LIST_FAILURE });
      });
  };
}

/* MEMO EDIT */
export function memoEditRequest(id, index, contents) {
  return (dispatch) => {
    dispatch({ type: MEMO_EDIT });

    return axios
      .put('/memo/modify/' + id, { contents })
      .then((response) => {
        dispatch({ type: MEMO_EDIT_SUCCESS, payload: { index, memo: response.data.memo } });
      })
      .catch((error) => {
        dispatch({ type: MEMO_EDIT_FAILURE, payload: { error: error.response.data.code } });
      });
  };
}

/* MEMO REMOVE */
export function memoRemoveRequest(id, index) {
  return (dispatch) => {
    dispatch({ type: MEMO_REMOVE });

    return axios
      .delete('/memo/delete/' + id)
      .then((response) => {
        dispatch({ type: MEMO_REMOVE_SUCCESS, payload: index });
      })
      .catch((error) => {
        dispatch({ type: MEMO_REMOVE_FAILURE, payload: { error: error.response.data.code } });
      });
  };
}

export function memoStarRequest(id, index) {
  return (dispatch) => {
    dispatch({ type: MEMO_STAR });
    // TO BE IMPLEMENTED
    return axios
      .post('/memo/star/' + id)
      .then((response) => {
        dispatch({ type: MEMO_STAR_SUCCESS, payload: { index, memo: response.data.memo } });
      })
      .catch((error) => {
        dispatch({ type: MEMO_STAR_FAILURE, payload: { error: error.response.data.code } });
      });
  };
}
