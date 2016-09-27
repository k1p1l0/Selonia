import React from 'react';

export default class Alert extends React.Component {
	render() {
		var show = this.props.show ? 'show': 'hide',
				className = `alert alert-success aler-box ${show}`;

		return <div class={className} role="alert">{this.props.children}</div>
	}
}