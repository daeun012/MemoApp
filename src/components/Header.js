import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    const loginButton = (
      <li>
        <Link to="/login">
          <i className="material-icons">vpn_key</i>
        </Link>
      </li>
    );

    const logoutButton = (
      <li>
        <a onClick={this.props.onLogout}>
          <i className="material-icons">lock_open</i>
        </a>
      </li>
    );

    return (
      <nav>
        <div className="nav-wrapper indigo lighten-3">
          <Link to="/" className="brand-logo center">
            MEMO
          </Link>
          <ul>
            <li>
              <a>
                <i className="material-icons">search</i>
              </a>
            </li>
          </ul>

          <div className="right ">
            <ul>{this.props.isLoggedIn ? logoutButton : loginButton}</ul>
          </div>
        </div>
      </nav>
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
