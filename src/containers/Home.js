import React from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from 'Components/';
import { memoPostRequest, memoListRequest } from '../actions/memo-actions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingState: false,
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
              location.reload(false);
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

  loadNewMemo = () => {
    // CANCEL IF THERE IS A PENDING REQUEST
    if (this.props.listStatus === 'WAITING')
      return new Promise((resolve, reject) => {
        resolve();
      });

    // IF PAGE IS EMPTY, DO THE INITIAL LOADING
    if (this.props.memoData.length === 0) return this.props.memoListRequest(true);

    return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id);
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
    return this.props.memoListRequest(false, 'old', lastId).then(() => {
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

    this.props.memoListRequest(true).then(() => {
      // BEGIN NEW MEMO LOADING LOOP
      loadUntilScrollable();
      loadMemoLoop();
    });
  }

  componentWillUnmount() {
    // STOPS THE loadMemoLoop
    console.log('finish');
    clearTimeout(this.memoLoaderTimeoutId);

    // REMOVE WINDOWS SCROLL LISTENER
    $(window).unbind();
  }

  render() {
    const write = <Write onPost={this.handlePost} />;

    return (
      <div className="wrapper">
        {this.props.isLoggedIn ? write : undefined}
        <MemoList data={this.props.memoData} currentUser={this.props.currentUser} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.status.isLoggedIn,
    postStatus: state.memo.post,
    currentUser: state.user.status.currentUser,
    memoData: state.memo.list.data,
    listStatus: state.memo.list.status,
    isLast: state.memo.list.isLast,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
