import React from 'react';

import auth from '../auth';

export default class Templates extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			templates: []
		};

		this.loadTemplates();
	}

	loadTemplates() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/templates`,
			crossDomain: true,
			headers: { 
      	'Authorization':  auth.getToken()
      },

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {
				if (data.Items.length !== this.state.templates.length && !this.UnMount) {
					this.setState({templates: data.Items})
				}
			}.bind(this),

			error: function() {
				console.log('Some trouble with token!');

				auth.logout();
				location.reload();
			}
    })
  }

  componentWillMount() {
		this.UnMount = false;
	}  

	componentWillUnmount() {
		this.UnMount = true;
	}

	render() {
		var templatesRows = this.state.templates.map(function(value, i) {
      return (
				<tr key={i}>
					<td>{value.name}</td>
					<td><a href="#">Download</a></td>
					<td><button class="btn btn-primary">Edit</button></td>
					<td><button class="btn btn-danger">Delete</button></td>
				</tr>
      );
    }.bind(this));

		return (
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Name</th>
							<th>Link</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{templatesRows}
					</tbody>
				</table>
			</div>
		)
	}
}