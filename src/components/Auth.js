import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  handleChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };
  handleLogin = () => {
    let id = this.state.username;
    let pw = this.state.password;
    this.props.onLogin(id, pw).then((success) => {
      if (!success) {
        this.setState({
          password: '',
        });
      }
    });
  };
  handleRegister = () => {
    let id = this.state.username;
    let pw = this.state.password;

    this.props.onRegister(id, pw).then((result) => {
      if (!result) {
        this.setState({
          username: '',
          password: '',
        });
      }
    });
  };
  handleKeyPress = (e) => {
    if (e.charCode == 13) {
      if (this.props.mode) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    }
  };

  render() {
    const inputBoxes = (
      <div>
        <div className="input-field col s12 username">
          <label>Username</label>
          <input name="username" type="text" className="validate" onChange={this.handleChange} value={this.state.username} />
        </div>
        <div className="input-field col s12">
          <label>Password</label>
          <input name="password" type="password" className="validate" onChange={this.handleChange} value={this.state.password} onKeyPress={this.handleKeyPress} />
        </div>
      </div>
    );

    const loginView = (
      <div>
        <div className="card-content">
          <div className="row">
            {inputBoxes}
            <a className="waves-effect waves-light btn  indigo lighten-2" onClick={this.handleLogin}>
              SUBMIT
            </a>
          </div>
        </div>

        <div className="footer">
          <div className="card-content">
            <div className="right">
              New Here?
              <Link to="/register" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

    const registerView = (
      <div className="card-content">
        <div className="row">
          {inputBoxes}
          <a className="waves-effect waves-light btn  indigo lighten-2" onClick={this.handleRegister}>
            CREATE
          </a>
        </div>
      </div>
    );

    return (
      <div className="container auth">
        <Link className="logo" to="/">
          MEMO
        </Link>
        <div className="card">
          <div className="header indigo lighten-3 white-text center">
            <div className="card-content">{this.props.mode ? 'LOGIN' : 'REGISTER'}</div>
          </div>
          {this.props.mode ? loginView : registerView}
        </div>
      </div>
    );
  }
}

Auth.propTypes = {
  mode: PropTypes.bool,
  onLogin: PropTypes.func,
  onRegister: PropTypes.func,
};

Auth.defaultProps = {
  mode: true,
  onLogin: (id, pw) => {
    console.error('login function not defined');
  },
  onRegister: (id, pw) => {
    console.error('register function not defined');
  },
};

export default Auth;
