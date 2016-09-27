import React from 'react';

import TemplatesChooser from './TemplatesChooser';

export default class ListContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recipients: [],	
		};
	}

	loadRecipients(id) {
    $.ajax({
      type: 'GET', 
			url: `${this.props.source}/${this.props.selectedCampgainId}`,

			success: function(data) {
				this.setState({recipients: data.Items});

				$('.loader').hide();
				$('#main-table').show();

			}.bind(this)
    });
  }

  createRecipientFromClient({name, email, templateId}) {
  	 $.ajax({
     	type: 'POST',
			url: `${this.props.source}/${this.props.selectedCampgainId}`,
			data: JSON.stringify({
				"recipients": [{
					campgainId: parseInt(this.props.selectedCampgainId),
					name,
					email,
					templateId
				}]
			}),

			contentType: "application/json",

			success: function(data) {
				console.log(data);
				this.loadRecipients();
			}.bind(this)
    });
  }

	componentDidMount() {
    this.loadRecipients(this.props.selectedCampgainId);
    setInterval(this.loadRecipients.bind(this), 1000);
  }

	getRecipients() {
		return this.state.recipients;
	}

	setRecipients(newOne) {
		this.setState({recipients: this.state.recipients.concat(newOne)});
	}

	reloadRecipients() {
		this.loadRecipients(this.props.selectedCampgainId);
	}

	render() {
		return <List get={this.getRecipients.bind(this)} set={this.setRecipients.bind(this)} createNew={this.createRecipientFromClient.bind(this)} />
	}
}

class List extends React.Component {
	onClick() {
		let data = {
			id: this.props.get().length + 1,
			name: $('#nameInput').val(),
			email: $('#emailInput').val(),
			templateId: 1
		}

		this.props.createNew(data);
	}

	render() {
		function sortById (a, b) {
			return a.id - b.id;
		}

 		var recipients = this.props.get().sort(sortById).map(function(recipient) {
      return (
				<RecipientTable data={recipient} key={recipient.id} />
      );
    }.bind(this));

		return (
			<div class="col-lg-8">
				<div class="panel panel-default">
				  <div class="panel-heading">CSV List</div>
					<div class="loader"></div>
					<table class="table animate-bottom" id="main-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Email</th>
								<th>Template</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{recipients}
						</tbody>
						<tfoot>
						<tr class="success">
							<td colSpan="2">
								<input type="text" class="form-control" id="nameInput" placeholder="Name input"/>
							</td>
							<td>
								<input type="text" class="form-control" id="emailInput" placeholder="Email input"/>
							</td>
							<td>
								<TemplatesChooser />
							</td>
							<td>
								<button type="button" class="btn btn-success" onClick={this.onClick.bind(this)} style={{width: '95%'}}>Add</button>
							</td>
						</tr>
						</tfoot>
					</table>
				</div>
			</div>
		)
	}
}

class RecipientTable extends React.Component {
	render() {
		return (
			<tr class="animation-bottom">
				<td>{this.props.data.id}</td>
				<td>{this.props.data.name}</td>
				<td>{this.props.data.email}</td>
				<td>
					<TemplatesChooser />
				</td>
				<td>
					<button type="button" class="btn btn-success" disabled>Send</button>
					<button type="button" class="btn btn-danger" disabled>Delete</button>
				</td>
			</tr>
		)
	}
}