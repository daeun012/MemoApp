import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';

class Memo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      value: props.data.contents,
    };
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  handleRemove = () => {
    let id = this.props.data._id;
    let index = this.props.index;
    this.props.onRemove(id, index);
  };

  handleStar = () => {
    let id = this.props.data._id;
    let index = this.props.index;
    this.props.onStar(id, index);
  };

  toggleEdit = () => {
    if (this.state.editMode) {
      let id = this.props.data._id;
      let index = this.props.index;
      let contents = this.state.value;

      this.props.onEdit(id, index, contents).then(() => {
        this.setState({
          editMode: !this.state.editMode,
        });
      });
    } else {
      this.setState({
        editMode: !this.state.editMode,
      });
    }
  };

  componentDidUpdate() {
    // WHEN COMPONENT UPDATES, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN LOGGED IN)
    $('#dropdown-button-' + this.props.data._id).dropdown({
      belowOrigin: true, // Displays dropdown below the button
    });
    if (this.state.editMode) {
      // Trigger key up event to the edit input so that it auto-resizes (Materializecss Feature)
      $(this.input).keyup();
    }
  }

  componentDidMount() {
    // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN REFRESHED)
    $('#dropdown-button-' + this.props.data._id).dropdown({
      belowOrigin: true, // Displays dropdown below the button
    });
    if (this.state.editMode) {
      // Trigger key up event to the edit input so that it auto-resizes (Materializecss Feature)
      $(this.input).keyup();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let current = {
      props: this.props,
      state: this.state,
    };

    let next = {
      props: nextProps,
      state: nextState,
    };

    let update = JSON.stringify(current) !== JSON.stringify(next);
    return update;
  }

  render() {
    const { data, ownership } = this.props;
    let starStyle = this.props.data.starred.indexOf(this.props.currentUser) > -1 ? { color: '#ff9980' } : {};

    const dropDownMenu = (
      <div className="option-button">
        <a className="dropdown-button" id={`dropdown-button-${data._id}`} data-activates={`dropdown-${data._id}`}>
          <i className="material-icons icon-button">more_vert</i>
        </a>
        <ul id={`dropdown-${data._id}`} className="dropdown-content">
          <li>
            <a style={{ color: '#7986cb' }} onClick={this.toggleEdit}>
              Edit
            </a>
          </li>
          <li>
            <a onClick={this.handleRemove} style={{ color: '#ef9a9a ' }}>
              Remove
            </a>
          </li>
        </ul>
      </div>
    );

    const memoView = (
      <div className="card">
        <div className="info">
          <Link to={`/search/${data.writer}`} className="username">
            {data.writer} {''}
          </Link>
          wrote a log · <TimeAgo date={data.date.created} />
          {data.is_edited ? (
            <span style={{ color: '#AAB5BC' }}>
              · Edited <TimeAgo date={data.date.edited} live={true} />
            </span>
          ) : undefined}
          {ownership ? dropDownMenu : undefined}
        </div>
        <div className="card-content">{data.contents}</div>
        <div className="footer">
          <i className="material-icons log-footer-icon star icon-button" style={starStyle} onClick={this.handleStar}>
            star
          </i>
          <span className="star-count">{data.starred.length}</span>
        </div>
      </div>
    );

    const editView = (
      <div className="write">
        <div className="card">
          <div className="card-content">
            <textarea
              ref={(ref) => {
                this.input = ref;
              }}
              className="materialize-textarea"
              value={this.state.value}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="card-action">
            <a style={{ fontWeight: 'bold', color: '#3f51b5' }} onClick={this.toggleEdit}>
              OK
            </a>
          </div>
        </div>
      </div>
    );
    return <div className="container memo">{this.state.editMode ? editView : memoView}</div>;
  }
}

Memo.propTypes = {
  data: PropTypes.object,
  ownership: PropTypes.bool,
  onEdit: PropTypes.func,
  index: PropTypes.number,
  onRemove: PropTypes.func,
  onStar: PropTypes.func,
  starStatus: PropTypes.object,
  currentUser: PropTypes.string,
};

Memo.defaultProps = {
  data: {
    _id: 'id1234567890',
    writer: 'Writer',
    contents: 'Contents',
    is_edited: false,
    date: {
      edited: new Date(),
      created: new Date(),
    },
    starred: [],
  },
  ownership: true,
  onEdit: (id, index, contents) => {
    console.error('onEdit function not defined');
  },
  onRemove: (id, index) => {
    console.error('remove function not defined');
  },
  index: -1,
  onStar: (id, index) => {
    console.error('star function not defined');
  },
  starStatus: {},
  currentUser: '',
};
export default Memo;
