import React from 'react';

import auth from '../auth';

const Login = React.createClass({
  getInitialState() {
    return {
      error: false
    }
  },

  handleSubmit(event) {
    event.preventDefault()

    const email = this.refs.email.value
    const pass = this.refs.pass.value

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true })

      const { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      } else {
        this.props.router.replace('/')
      }
    })
  },

  render() {
    return (
      <div class="wrapper">
        <form onSubmit={this.handleSubmit} class="form-signin">       
        <h2 class="form-signin-heading">Please login</h2>
        <input type="text" ref="email" class="form-control" name="username" placeholder="Username" required="" autofocus="" />
        <input type="password" ref="pass" class="form-control" name="password" placeholder="Password" required=""/>      
        <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>   
         {this.state.error && (
          <p>Bad login information</p>
          )}
        </form>
      </div>
    )
  }
});

export default Login;