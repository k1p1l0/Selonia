import React from 'react';

import TemplatesChooserContainer from '../components/TemplatesChooserContainer';

import ListBtnEditRecipient from './ListBtnEditRecipient';
import shortid from 'shortid';

export default class ListBody extends React.Component {

	createRecipientFromClient ({target}) {
		let $templateId = $('select[name="newRecipientTemplate"] option:selected').val();
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

    if (~$templateId.indexOf('def')) {
      this.props.setAlert({message:'Please choose a template', type:'info'});

      return;
    }

		let data = {
			id: shortid.generate(),
			name: $name,
			email: $email,
			templateId: $templateId,
			target
		};

		// console.log(data);
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
				<RecipientTable data={recipient} loadRecipients={this.props.loadRecipients} source={this.props.source} toggleLoadIcon={this.props.toggleLoadIcon} setAlert={this.props.setAlert} key={recipient.id} templates={this.props.templates} deleteRecipient={this.deleteRecipient.bind(this)} i={i}/>
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
		let { id, name, email, templateId } = this.props.data;
		let { i } = this.props;

		let buttonProps = {
			className: "btn btn-info"
		}

		//We need to generate template name from ID and connect it with our current templates that we load before from server
		let templateName = this.props.templates.filter(function(template) {
			return template.id === templateId
		});

		if (templateName.length === 0) {
			templateName = 'No template';
		} else {
			templateName = templateName[0].name
		}

		return (
			<tr class="animation-bottom">
				<td>{i + 1}</td>
				<td>{name}</td>
				<td>{email}</td>
				<td>{templateName}</td>
				<td>
					<ListBtnEditRecipient loadRecipients={this.props.loadRecipients} templates={this.props.templates} source={this.props.source} toggleLoadIcon={this.props.toggleLoadIcon} setAlert={this.props.setAlert} defTemplate={templateName} recipient={this.props.data} buttonProps={buttonProps}>Edit</ListBtnEditRecipient>
					<button type="button" class="btn btn-danger" onClick={this.deleteRecipient.bind(this, id)}>Delete</button>
				</td>
			</tr>
		)
	}
}