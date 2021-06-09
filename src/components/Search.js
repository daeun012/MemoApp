import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
    };

    // LISTEN ESC KEY, CLOSE IF PRESSED
    const listenEscKey = (evt) => {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        this.handleClose();
      }
    };

    document.onkeydown = listenEscKey;
  }

  handleClose = () => {
    this.handleSearch('');
    document.onkeydown = null;
    this.props.onClose();
  };

  handleChange = (e) => {
    this.setState({
      keyword: e.target.value,
    });
    this.handleSearch(e.target.value);
  };

  handleSearch = (keyword) => {
    this.props.onSearch(keyword);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (this.props.usernames.length > 0) {
        this.props.history.push('/wall/' + this.props.usernames[0].username);
        this.handleClose();
      }
    }
  };

  render() {
    const mapDataToLinks = (data) => {
      return data.map((user, index) => (
        <li key={index}>
          <Link to={`/wall/${user.username}`} onClick={this.handleClose}>
            {user.username}
          </Link>
        </li>
      ));
    };

    return (
      <div className="search-screen white-text">
        <div className="right">
          <a className="waves-effect waves-light btn red lighten-1" onClick={this.handleClose}>
            CLOSE
          </a>
        </div>
        <div className="container">
          <input placeholder="Search a user" value={this.state.keyword} onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
          <ul className="search-results">{mapDataToLinks(this.props.usernames)}</ul>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  onClose: PropTypes.func,
  onSearch: PropTypes.func,
  usernames: PropTypes.array,
};

Search.defaultProps = {
  onClose: () => {
    console.error('onClose not defined');
  },
  onSearch: () => {
    console.error('onSearch not defined');
  },
  usernames: [],
};

export default Search;
