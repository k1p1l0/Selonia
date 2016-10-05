import React from 'react';

import BucketsChooser from '../../components/BucketsChooser';

export default class AddDomainContainer extends React.Component {
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
				this.setState({
					buckets: data
				}, function() {
					this.forceUpdate()
				}.bind(this));
			}.bind(this)
    });
  }

	componentWillMount() {
		this.loadBuckets();
		// this.loadInterval = setInterval(this.loadBuckets.bind(this), 5000);
	}

	render() {
		return (
			<AddDomain values={this.state.buckets} />
		)
	}
}

class AddDomain extends React.Component {
	render() {
		return (
			<div class="panel panel-default">
			 <div class="panel-heading">Add domain</div>
  			<div class="panel-body">
  				<div class="row">
  					<div class="col-lg-8">
  						<BucketsChooser values={this.props.values} />
  					</div>
  					<div class="col-lg-2">
  						<button type="button" class="btn btn-primary btn-block" onClick={this.props.onUpload}>Add</button>
  					</div>
  				</div>		
  			</div>
			</div>
		)
	}
}