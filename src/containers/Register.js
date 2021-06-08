// src/containers/Register.js
import React from 'react';
import { Auth } from 'Components';
import { connect } from 'react-redux';
import { registerRequest } from '../actions/user-actions';

class Register extends React.Component {
  handleRegister = (id, pw) => {
    return this.props.registerRequest(id, pw).then(() => {
      if (this.props.status === 'SUCCESS') {
        Materialize.toast('Success! Please log in.', 2000);
        this.props.history.push('/login');
        return true;
      } else {
        let errorMessage = ['Invalid Username', 'Password is too short', 'Username already exists'];

        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
        Materialize.toast($toastContent, 2000);
        return false;
      }
    });
  };
  render() {
    return (
      <div>
        <Auth mode={false} onRegister={this.handleRegister} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.user.register.status,
    errorCode: state.user.register.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerRequest: (id, pw) => {
      return dispatch(registerRequest(id, pw));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
