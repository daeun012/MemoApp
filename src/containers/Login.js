// src/containers/Login.js
import React from 'react';
import { Auth } from '../components';
class Login extends React.Component {
  render() {
    return (
      <div>
        <Auth mode={true} />
      </div>
    );
  }
}

export default Login;
