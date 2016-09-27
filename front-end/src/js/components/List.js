import React from 'react';

import TemplatesChooser from './TemplatesChooser';

export default class ListContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recipients: [],	
		};
	}

	loadRecipients(newId) {
		var URL = (newId > 0) ? `${this.props.source}/${newId}`: `${this.props.source}/${this.props.selectedCampgainId}`

    $.ajax({
      type: 'GET', 
			url: URL,

			success: function(data) {
				if (data.Items.length === 0) {
					this.setState({recipients: []})
				} else {
					this.setState({recipients: data.Items});
				}
				
				$('.loader').hide();
				$('#main-table').show();

			}.bind(this),

			error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
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

  componentWillMount() {
  	this.loadRecipients();
  }

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.selectedCampgainId !== nextProps.selectedCampgainId) {
			this.loadRecipients(nextProps.selectedCampgainId);
    	return true;
		} else if (nextState.recipients.length > 0) {
			return true;
		}

		return false;
  }

	setRecipients(newOne) {
		this.setState({recipients: this.state.recipients.concat(newOne)});
	}

	render() {
		return <List get={this.state.recipients} set={this.setRecipients.bind(this)} createNew={this.createRecipientFromClient.bind(this)} />
	}
}

class List extends React.Component {
	onClick() {
		let data = {
			id: this.props.get.length + 1,
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

 		var recipients = this.props.get.sort(sortById).map(function(recipient) {
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