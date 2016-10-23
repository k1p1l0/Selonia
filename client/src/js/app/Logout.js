import React from 'react';

import auth from '../auth';

import { Link } from 'react-router';

const Logout = React.createClass({
  componentDidMount() {
    auth.logout()
  },

  render() {
    return (
      <div style={{marginTop: '20px'}} class="container">
        <div class="jumbotron">
          <h1>You're now logged out</h1>
          <p><Link class="btn btn-primary btn-lg" to='login'>Login</Link></p>
        </div>
      </div>
    )
  }
})

export default Logout;