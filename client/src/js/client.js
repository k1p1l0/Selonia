import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory} from 'react-router';

import App from './app/App';
import Layout from './app/Layout';
import Logs from './app/Logs';

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

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={LayoutWrapper}></IndexRoute>
			<Route path='/logs' component={LogsWrapper} />
		</Route>
	</Router>,
$app[0])