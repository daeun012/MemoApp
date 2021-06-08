import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';

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
  }

  componentDidMount() {
    // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN REFRESHED)
    $('#dropdown-button-' + this.props.data._id).dropdown({
      belowOrigin: true, // Displays dropdown below the button
    });
  }
  render() {
    const { data, ownership } = this.props;

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
            <a style={{ color: '#ef9a9a ' }}>Remove</a>
          </li>
        </ul>
      </div>
    );

    const memoView = (
      <div className="card">
        <div className="info">
          <a className="username">{this.props.data.writer}</a> wrote a log · <TimeAgo date={this.props.data.date.created} />
          {data.is_edited ? (
            <span style={{ color: '#AAB5BC' }}>
              · Edited <TimeAgo date={this.props.data.date.edited} live={true} />
            </span>
          ) : undefined}
          {ownership ? dropDownMenu : undefined}
        </div>
        <div className="card-content">{data.contents}</div>
        <div className="footer">
          <i className="material-icons log-footer-icon star icon-button">star</i>
          <span className="star-count">{data.starred.length}</span>
        </div>
      </div>
    );

    const editView = (
      <div className="write">
        <div className="card">
          <div className="card-content">
            <textarea className="materialize-textarea" value={this.state.value} onChange={this.handleChange}></textarea>
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
  index: -1,
};
export default Memo;
