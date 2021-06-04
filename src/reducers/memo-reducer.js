import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  post: {
    status: 'INIT',
    error: -1,
  },
  list: {
    status: 'INIT',
    data: [],
    isLast: false,
  },
};

export default function memo(state = initialState, { type, payload }) {
  switch (type) {
    case types.MEMO_POST:
      return update(state, {
        post: {
          status: { $set: 'WAITING' },
          error: { $set: -1 },
        },
      });
    case types.MEMO_POST_SUCCESS:
      return update(state, {
        post: {
          status: { $set: 'SUCCESS' },
        },
      });
    case types.MEMO_POST_FAILURE:
      return update(state, {
        post: {
          status: { $set: 'FAILURE' },
          error: { $set: payload },
        },
      });
    case types.MEMO_LIST:
      return update(state, {
        list: {
          status: { $set: 'WAITING' },
        },
      });
    case types.MEMO_LIST_SUCCESS:
      if (payload.isInitial) {
        return update(state, {
          list: {
            status: { $set: 'SUCCESS' },
            data: { $set: payload.data },
            isLast: { $set: payload.data.length < 6 },
          },
        });
      } else {
        if (payload.listType === 'new') {
          return update(state, {
            list: {
              status: { $set: 'SUCCESS' },
              data: { $unshift: payload.data },
            },
          });
        } else {
          return update(state, {
            list: {
              status: { $set: 'SUCCESS' },
              data: { $push: payload.data },
              isLast: { $set: payload.data.length < 6 },
            },
          });
        }
      }
    // loading older or newer memo
    // to be implemented..

    case types.MEMO_LIST_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
}
