import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Write, MemoList } from 'Components/';
import { memoPostRequest, memoListRequest, memoEditRequest, memoRemoveRequest, memoRemoveFromData, memoStarRequest } from '../actions/memo-actions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingState: false,
      initiallyLoaded: false,
    };
  }
  /* POST MEMO */
  handlePost = (contents) => {
    return this.props.memoPostRequest(contents).then(() => {
      if (this.props.postStatus.status === 'SUCCESS') {
        // TRIGGER LOAD NEW MEMO
        this.loadNewMemo().then(() => {
          Materialize.toast('Success!', 2000);
        });
      } else {
        let $toastContent;
        switch (this.props.postStatus.error) {
          case 1:
            // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
            $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
            Materialize.toast($toastContent, 2000);
            setTimeout(() => {
              this.props.location.reload(false);
            }, 2000);
            break;
          case 2:
            $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
            Materialize.toast($toastContent, 2000);
            break;
          default:
            $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
            Materialize.toast($toastContent, 2000);
            break;
        }
      }
    });
  };

  /* EDIT MEMO */
  handleEdit = (id, index, contents) => {
    return this.props.memoEditRequest(id, index, contents).then(() => {
      if (this.props.editStatus.status === 'SUCCESS') {
        Materialize.toast('Success!', 2000);
      } else {
        let errorMessage = ['Something broke', 'Please write soemthing', 'You are not logged in', 'That memo does not exist anymore', 'You do not have permission'];

        let error = this.props.editStatus.error;

        // NOTIFY ERROR
        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
        Materialize.toast($toastContent, 2000);

        // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
        if (error === 3) {
          setTimeout(() => {
            this.props.location.reload(false);
          }, 2000);
        }
      }
    });
  };

  handleRemove = (id, index) => {
    this.props.memoRemoveRequest(id, index).then(() => {
      if (this.props.removeStatus.status === 'SUCCESS') {
        // LOAD MORE MEMO IF THERE IS NO SCROLLBAR
        // 1 SECOND LATER. (ANIMATION TAKES 1SEC)
        setTimeout(() => {
          if ($('body').height() < $(window).height()) {
            this.loadOldMemo();
          }
        }, 1000);
      } else {
        let errorMessage = ['Something broke', 'You are not logged in', 'That memo does not exist', 'You do not have permission'];

        // NOTIFY ERROR
        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
        Materialize.toast($toastContent, 2000);

        // IF NOT LOGGED IN, REFRESH THE PAGE
        if (this.props.removeStatus.error === 2) {
          setTimeout(() => {
            this.props.location.reload(false);
          }, 2000);
        }
      }
    });
  };

  handleStar = (id, index) => {
    this.props.memoStarRequest(id, index).then(() => {
      if (this.props.starStatus.status !== 'SUCCESS') {
        let errorMessage = ['Something broke', 'You are not logged in', 'That memo does not exist'];

        // NOTIFY ERROR
        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.starStatus.error - 1] + '</span>');
        Materialize.toast($toastContent, 2000);

        // IF NOT LOGGED IN, REFRESH THE PAGE
        if (this.props.starStatus.error === 2) {
          setTimeout(() => {
            this.props.location.reload(false);
          }, 2000);
        }
      }
    });
  };

  loadNewMemo = () => {
    // CANCEL IF THERE IS A PENDING REQUEST
    if (this.props.listStatus === 'WAITING')
      return new Promise((resolve, reject) => {
        resolve();
      });

    // IF PAGE IS EMPTY, DO THE INITIAL LOADING
    if (this.props.memoData.length === 0) return this.props.memoListRequest(true, undefined, undefined, this.props.username);

    return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id, this.props.username);
  };

  loadOldMemo = () => {
    // 마지막 페이지면 요청 취소
    if (this.props.isLast) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    // 아니면 그 뒷 페이지 가져오기
    let lastId = this.props.memoData[this.props.memoData.length - 1]._id;

    // START REQUEST
    return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(() => {
      // IF IT IS LAST PAGE, NOTIFY
      if (this.props.isLast) {
        Materialize.toast('You are reading the last page', 2000);
      }
    });
  };

  componentDidMount() {
    // 5초마다 새 메모 로딩
    const loadMemoLoop = () => {
      this.loadNewMemo().then(() => {
        this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
      });
    };

    const loadUntilScrollable = () => {
      // 스크롤바가 생기지 않았다면.
      if ($('body').height() < $(window).height()) {
        this.loadOldMemo().then(() => {
          // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
          if (!this.props.isLast) {
            loadUntilScrollable();
          }
        });
      }
    };

    // 무한 스크롤링
    $(window).scroll(() => {
      // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
      if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
        if (!this.state.loadingState) {
          this.loadOldMemo();
          this.setState({
            loadingState: true,
          });
        }
      } else {
        if (this.state.loadingState) {
          this.setState({
            loadingState: false,
          });
        }
      }
    });

    this.props.memoListRequest(true, undefined, undefined, this.props.username).then(() => {
      // BEGIN NEW MEMO LOADING LOOP
      setTimeout(loadUntilScrollable, 1000);
      loadMemoLoop();
      this.setState({
        initiallyLoaded: true,
      });
    });
  }

  componentWillUnmount() {
    // STOPS THE loadMemoLoop
    console.log('finish');
    clearTimeout(this.memoLoaderTimeoutId);

    // REMOVE WINDOWS SCROLL LISTENER
    $(window).unbind();

    this.setState({
      initiallyLoaded: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.username !== prevProps.username) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  render() {
    const write = <Write onPost={this.handlePost} />;

    const emptyView = (
      <div className="container">
        <div className="empty-page">
          <b>{this.props.username}</b> isn't registered or hasn't written any memo
        </div>
      </div>
    );

    const wallHeader = (
      <div>
        <div className="container wall-info">
          <div className="card wall-info blue lighten-2 white-text">
            <div className="card-content">{this.props.username}</div>
          </div>
        </div>
        {this.props.memoData.length === 0 && this.state.initiallyLoaded ? emptyView : undefined}
      </div>
    );

    return (
      <div className="wrapper">
        {typeof this.props.username !== 'undefined' ? wallHeader : undefined}
        {this.props.isLoggedIn && typeof this.props.username === 'undefined' ? write : undefined}
        <MemoList data={this.props.memoData} currentUser={this.props.currentUser} onEdit={this.handleEdit} onRemove={this.handleRemove} onStar={this.handleStar} />
      </div>
    );
  }
}

Home.propTypes = {
  username: PropTypes.string,
};

Home.defaultProps = {
  username: undefined,
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.status.isLoggedIn,
    postStatus: state.memo.post,
    currentUser: state.user.status.currentUser,
    memoData: state.memo.list.data,
    listStatus: state.memo.list.status,
    isLast: state.memo.list.isLast,
    editStatus: state.memo.edit,
    removeStatus: state.memo.remove,
    starStatus: state.memo.star,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    memoPostRequest: (contents) => {
      return dispatch(memoPostRequest(contents));
    },
    memoListRequest: (isInitial, listType, id, username) => {
      return dispatch(memoListRequest(isInitial, listType, id, username));
    },
    memoEditRequest: (id, index, contents) => {
      return dispatch(memoEditRequest(id, index, contents));
    },
    memoRemoveRequest: (id, index) => {
      return dispatch(memoRemoveRequest(id, index));
    },
    memoStarRequest: (id, index) => {
      return dispatch(memoStarRequest(id, index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
