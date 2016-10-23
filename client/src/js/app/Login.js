import React from 'react';
import AlertContainer from 'react-alert';

import auth from '../auth';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    };

    this.alertOptions = {
      offset: 0,
      position: 'top left',
      theme: 'light',
      time: 10000,
      transition: 'scale'
    };
  }

  setAlert({message, type}) {
    msg.show(message, {
      type
    });
  }

  toggleLoadIcon(target, text) {
    let width = $(target).width();

    if ($(target).children()[0] === undefined) {
      $(target).prop('disabled', true);
      $(target).html(`<div style="width: ${width}px" class="glyphicon glyphicon-repeat gly-spin"></div>`);
    } else {
      $(target).prop('disabled', false);
      $(target).html(text);
    }
  }

  handleSubmit(event) {
    event.preventDefault()

    this.toggleLoadIcon('#loginBtn', 'Login');

    const email = this.refs.email.value
    const pass = this.refs.pass.value

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn) {
        this.setAlert({
          message: 'Bad login information..try again',
          type: 'info'
        });

        this.toggleLoadIcon('#loginBtn', 'Login');

        return this.setState({ error: true })
      }

      const { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      } else {
        this.props.router.replace('/')
      }
    })
  }

  render() {
    return (
      <div class="wrapper">
        <form onSubmit={this.handleSubmit.bind(this)} class="form-signin">       
          <h2 class="form-signin-heading">Please login</h2>
          <input type="text" ref="email" class="form-control" name="username" placeholder="Username" required="" autofocus="" />
          <input type="password" ref="pass" class="form-control" name="password" placeholder="Password" required=""/>      
          <button class="btn btn-lg btn-primary btn-block" id="loginBtn" type="submit">Login</button>   
        </form>
        <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
      </div>
    )
  }
}