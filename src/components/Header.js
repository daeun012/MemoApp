import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Search } from 'Components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
    };
  }

  toggleSearch = () => {
    this.setState({ search: !this.state.search });
  };

  render() {
    const loginButton = (
      <li>
        <Link to="/login">
          <i className="material-icons left">vpn_key</i>Sign In
        </Link>
      </li>
    );

    const logoutButton = (
      <li>
        <a onClick={this.props.onLogout}>
          <i className="material-icons left">lock_open</i>Sign Out
        </a>
      </li>
    );

    return (
      <div>
        <nav>
          <div className="nav-wrapper indigo lighten-3">
            <Link to="/" className="brand-logo center">
              MEMO
            </Link>
            <ul>
              <li>
                <a onClick={this.toggleSearch}>
                  <i className="material-icons">search</i>
                </a>
              </li>
            </ul>

            <div className="right ">
              <ul>{this.props.isLoggedIn ? logoutButton : loginButton}</ul>
            </div>
          </div>
        </nav>
        <ReactCSSTransitionGroup transitionName="search" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {this.state.search ? <Search onClose={this.toggleSearch} onSearch={this.props.onSearch} usernames={this.props.usernames} /> : undefined}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func,
};

Header.defaultProps = {
  isLoggedIn: false,
  onLogout: () => {
    console.error('logout function not defined');
  },
};

export default Header;
