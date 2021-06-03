// src/containers/Register.js
import React from 'react';
import { Auth } from '../components';
class Register extends React.Component {
  render() {
    return (
      <div>
        <Auth mode={false} />
      </div>
    );
  }
}

export default Register;
