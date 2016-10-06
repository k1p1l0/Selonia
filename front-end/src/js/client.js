import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory} from 'react-router';

import LayoutContainer from './containers/Layout';
import App from './containers/App';

const API_URL = 'https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod';

const $app = $('#app');

class LayoutWrapper extends React.Component {
  render() {
    return (
    	<LayoutContainer source={API_URL} />
    );
  }
}

class Logs extends React.Component {
  render() {
    return (
			<h1>123</h1>
    );
  }
}

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={LayoutWrapper}></IndexRoute>
			<Route path='/logs' component={Logs} />
		</Route>
	</Router>,
$app[0])

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};