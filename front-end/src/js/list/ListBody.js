import React from 'react';

import TemplatesChooserContainer from '../components/TemplatesChooserContainer';

import ListBtnEditRecipient from './ListBtnEditRecipient';

export default class ListBody extends React.Component {

	createRecipientFromClient ({target}) {
		let $templateName = $('select[name="newRecipientTemplate"] option:selected').text();
		let $name = $('#nameInput').val();
		let $email = $('#emailInput').val();

   	if (!$name.length) {
      this.props.setAlert({message:'Please input the name', type:'info'});

      return;
    }   	

    if (!$email.length) {
      this.props.setAlert({message:'Please input the email', type:'info'});

      return;
    }

    if (~$templateName.indexOf('Choose')) {
      this.props.setAlert({message:'Please choose a template', type:'info'});

      return;
    }

		let data = {
			id: parseInt($name.hashCode() + $email.hashCode()),
			name: $name.val(),
			email: $email.val(),
			templateName: $templateName,
			target
		};

		this.props.createRecipientFromClient(data);
		this.clear();
	}

	deleteRecipient(id, {target}) {
		this.props.deleteRecipient({id, target});
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
				<RecipientTable data={recipient} key={recipient.id} templates={this.props.templates} deleteRecipient={this.deleteRecipient.bind(this)} i={i}/>
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
							<TemplatesChooserContainer templates={this.props.templates} selectName="newRecipientTemplate" />
						</td>
						<td>
							<button id="addRecipient" type="button" class="btn btn-success" onClick={this.createRecipientFromClient.bind(this)} style={{width: '120px'}}>Add</button>
						</td>
					</tr>
					</tfoot>
			</table>
		)
	}
}

class RecipientTable extends React.Component {
	deleteRecipient (id, e) {
		this.props.deleteRecipient(id, e);
	}

	render() {
		let { id, name, email, templateName } = this.props.data;
		let { i } = this.props;

		let buttonProps = {
			className: "btn btn-info"
		}

		return (
			<tr class="animation-bottom">
				<td>{i + 1}</td>
				<td>{name}</td>
				<td>{email}</td>
				<td>{templateName}</td>
				<td>
					<ListBtnEditRecipient templates={this.props.templates} defTemplate={templateName} recipient={this.props.data} buttonProps={buttonProps}>Edit</ListBtnEditRecipient>
					<button type="button" class="btn btn-danger" onClick={this.deleteRecipient.bind(this, id)}>Delete</button>
				</td>
			</tr>
		)
	}
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};