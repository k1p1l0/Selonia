import React from 'react';

import BucketsChooser from '../components/BucketsChooser';

export default class PanelDomain extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buckets: []
		};
	}

	loadBuckets() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/buckets`,

			success: function(data) {
				if (!this.UnMount) {
					this.setState({
						buckets: data
					});
				}
			}.bind(this)
    });
  }

	componentWillMount() {
		this.UnMount = false;
		this.loadBuckets();
	}	

	componentWillUnmount() {
		this.UnMount = true;
	}

	render() {
		return (
			<AddDomain name={this.props.name} values={this.state.buckets} />
		)
	}
}

class AddDomain extends React.Component {
	render() {
		return <BucketsChooser name={this.props.name} values={this.props.values} />
	}
}