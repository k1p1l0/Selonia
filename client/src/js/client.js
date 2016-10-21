import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, withRouter} from 'react-router';

import App from './app/App';
import Layout from './app/Layout';
import Logs from './app/Logs';
import Login from './app/Login';

import auth from './auth';

const API_URL = 'https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod';

const $app = $('#app');

class LayoutWrapper extends React.Component {
  render() {
    return (
    	<Layout source={API_URL} />
    );
  }
}

class LogsWrapper extends React.Component {
  render() {
    return (
			<Logs source={API_URL} />
    );
  }
}

// class LoginWrapper extends React.Component {
//   render() {
//     return <Login location={this.props.location} router={this.props.router}/>
//   }
// }

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDOM.render(
	<Router history={hashHistory}>
    <Route path="login" component={Login} />

    <Route path='/' component={App} onEnter={requireAuth}>
      <IndexRoute component={LayoutWrapper}></IndexRoute>
      <Route path='/logs' component={LogsWrapper} />
    </Route>
	</Router>,
$app[0])