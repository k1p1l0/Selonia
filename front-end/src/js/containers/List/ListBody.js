import React from 'react';

import TemplatesChooserContainer from '../../components/TemplatesChooserContainer';

export default class ListBody extends React.Component {
	createNewRecipient () {
		let data = {
			id: parseInt($('#nameInput').val().hashCode() + $('#emailInput').val().hashCode()),
			name: $('#nameInput').val(),
			email: $('#emailInput').val(),
			templateName: $('select[name="newRecipientTemplate"] option:selected').text()
		};

		this.props.createNewRecipient(data);
		this.clear();
	}

	deleteRecipient(id) {
		this.props.deleteRecipient(id);
	}

	clear() {
		$('#nameInput').val('');	
		$('#emailInput').val('');	
		$('select[name="newRecipientTemplate"]').val('def');
	}

	render() {
		function sortById (a, b) {
			return a.id - b.id;
		}

 		let recipients = this.props.getRecipients.sort(sortById).map(function(recipient, i) {
      return (
				<RecipientTable data={recipient} key={recipient.id} deleteRecipient={this.deleteRecipient.bind(this)} i={i}/>
      );
    }.bind(this));

		return (
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
							<TemplatesChooserContainer source={this.props.source} selectName="newRecipientTemplate" />
						</td>
						<td>
							<button type="button" class="btn btn-success" onClick={this.createNewRecipient.bind(this)} style={{width: '95%'}}>Add</button>
						</td>
					</tr>
					</tfoot>
			</table>
		)
	}
}

class RecipientTable extends React.Component {
	deleteRecipient (id) {
		this.props.deleteRecipient(id);
	}

	render() {
		return (
			<tr class="animation-bottom">
				<td>{this.props.i + 1}</td>
				<td>{this.props.data.name}</td>
				<td>{this.props.data.email}</td>
				<td>
						{this.props.data.templateName}
				</td>
				<td>
					<button type="button" class="btn btn-success" disabled>Send</button>
					<button type="button" class="btn btn-danger" onClick={this.deleteRecipient.bind(this, this.props.data.id)}>Delete</button>
				</td>
			</tr>
		)
	}
}