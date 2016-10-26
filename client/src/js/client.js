import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, withRouter} from 'react-router';

import App from './app/App';
import LayoutCampaigns from './app/LayoutCampaigns';
import LayoutGlobal from './app/LayoutGlobal';
import Templates from './app/Templates';
import Logs from './app/Logs';
import Login from './app/Login';
import Logout from './app/Logout';

import auth from './auth';
import config from './config.json';

const API_URL = config.ENDPOINT;
const $app = $(config.ROOT_ELEMENT);

class LayoutCampaignsWrapper extends React.Component {
  render() {
    return (
    	<LayoutCampaigns source={API_URL} />
    );
  }
}

class LayoutGlobalWrapper extends React.Component {
  render() {
    return (
      <LayoutGlobal source={API_URL} />
    );
  }
}

class TemplatesWrapper extends React.Component {
  render() {
    return (
      <Templates source={API_URL} />
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

const LoginWrapper = withRouter(Login);
const LogoutWrapper = withRouter(Logout);

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
    <Route path="login" component={LoginWrapper} />
    <Route path='logout' component={LogoutWrapper} />

    <Route path='/' component={App} onEnter={requireAuth}>
      <IndexRoute component={LayoutGlobalWrapper}></IndexRoute>
      <Route path='campaigns' component={LayoutCampaignsWrapper} />
      <Route path='templates' component={TemplatesWrapper} />
      <Route path='logs' component={LogsWrapper} />
    </Route>
	</Router>,
$app[0])