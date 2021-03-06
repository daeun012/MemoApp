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
  edit: {
    status: 'INIT',
    error: -1,
  },
  remove: {
    status: 'INIT',
    error: -1,
  },
  star: {
    status: 'INIT',
    error: -1,
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
    case types.MEMO_LIST_FAILURE:
      return update(state, {
        list: {
          status: { $set: 'FAILURE' },
        },
      });
    case types.MEMO_EDIT:
      return update(state, {
        edit: {
          status: { $set: 'WAITING' },
          error: { $set: -1 },
          memo: { $set: undefined },
        },
      });
    case types.MEMO_EDIT_SUCCESS:
      return update(state, {
        edit: {
          status: { $set: 'SUCCESS' },
        },
        list: {
          data: {
            [payload.index]: { $set: payload.memo },
          },
        },
      });
    case types.MEMO_EDIT_FAILURE:
      return update(state, {
        edit: {
          status: { $set: 'FAILURE' },
          error: { $set: payload.error },
        },
      });
    case types.MEMO_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
          error: { $set: -1 },
        },
      });
    case types.MEMO_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' },
        },
        list: {
          data: { $splice: [[payload.index, 1]] },
        },
      });
    case types.MEMO_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
          error: { $set: payload.error },
        },
      });
    case types.MEMO_STAR:
      return update(state, {
        star: {
          status: { $set: 'WAITING' },
          error: { $set: -1 },
        },
      });
    case types.MEMO_STAR_SUCCESS:
      return update(state, {
        star: {
          status: { $set: 'SUCCESS' },
        },
        list: {
          data: {
            [payload.index]: { $set: payload.memo },
          },
        },
      });
    case types.MEMO_STAR_FAILURE:
      return update(state, {
        star: {
          status: { $set: 'FAILURE' },
          error: { $set: payload.error },
        },
      });
    default:
      return state;
  }
}
