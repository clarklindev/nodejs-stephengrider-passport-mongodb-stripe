import React, { Component } from 'react';
import { connect } from 'react-redux';
class Login extends Component {
  render() {
    return (
      <div>
        <h3>Login</h3>
        <ul>
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
          <li>
            <a href="/auth/facebook">Login With Facebook</a>
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default connect(mapStateToProps)(Login);
