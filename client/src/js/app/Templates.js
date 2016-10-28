import React from 'react';
import AlertContainer from 'react-alert';

import auth from '../auth';

import config from '../config.json';

import TemplateEditBtn from '../templates/TemplateEditBtn';

export default class Templates extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			templates: [],
			templatesTimerId: 0
		};

		this.startIntervalLoadTemplates();

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

  deleteTemplate({id, name}) {
  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/templates`,
  		data: JSON.stringify({
  			id,
  			name
  		}),
  		contentType: "application/json",
  		crossDomain: true,

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

  		success: function(data) {

  			if (!data.errorMessage) {
					this.setAlert({message: 'Template is successfully deleted ', type: 'success'});
					this.loadTemplates();
				} else {
					this.setAlert({message: data.errorMessage, type: 'error'});
				}

  		}.bind(this),

  		error: function() {
				console.log('Some trouble with token!');

				// auth.logout();
				// location.reload();
			}
  	});
  }

  componentWillMount() {
		this.UnMount = false;
	}  

	componentWillUnmount() {
		this.UnMount = true;
		this.stopIntervalTemplateLoad();
	}

	startIntervalLoadTemplates() {
		// if (this.state.recipientsTimerId >= 0) {
			let templatesTimerId = setInterval(this.loadTemplates.bind(this), 3000);
			this.setState({templatesTimerId});
		// }
	}

	stopIntervalTemplateLoad() {
		this.state.templatesTimerId && clearInterval(this.state.templatesTimerId);
	}

	render() {
		var templatesRows = this.state.templates.map(function(value, i) {
      return (
				<tr key={i}>
					<td>{value.name}</td>
					<td><a href={`${config.STATIC_URL}/templates/${value.name}/html.ejs`}>Link</a></td>
					<td><TemplateEditBtn setAlert={this.setAlert.bind(this)} source={this.props.source} loadTemplates={this.loadTemplates.bind(this)} data={value}>Edit</TemplateEditBtn></td>
					<td><button onClick={this.deleteTemplate.bind(this, value)} class="btn btn-danger">Delete</button></td>
				</tr>
      );
    }.bind(this));

		return (
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Name</th>
							<th>Download</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{templatesRows}
					</tbody>
				</table>
				<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
			</div>
		)
	}
}