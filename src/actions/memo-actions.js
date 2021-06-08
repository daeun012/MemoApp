import { MEMO_POST, MEMO_POST_SUCCESS, MEMO_POST_FAILURE, MEMO_LIST, MEMO_LIST_SUCCESS, MEMO_LIST_FAILURE } from './ActionTypes';
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
        dispatch({ type: MEMO_POST_FAILURE, payload: error });
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
      // or url + '/' + listType + '/' +  id
    } else {
      // load memos of specific user
      /* to be implemented */
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
