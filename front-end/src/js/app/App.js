import React from 'react';

import Navbar from './Navbar';

export default class App extends React.Component {
	render() {
		return (
    	<div class="container content">
				<div class="row">
					<Navbar location={this.props.location} history={this.props.history} />
					
					{this.props.children}
				</div>
			</div>
		)
	}
}