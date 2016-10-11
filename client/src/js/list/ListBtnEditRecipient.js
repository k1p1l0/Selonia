import React from 'react';

import { Button, Modal } from 'react-bootstrap';

import TemplatesChooserContainer from '../components/TemplatesChooserContainer';

export default class ListBtnEditRecipient extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  showModal() {
    this.setState({showModal: true});

  }

  closeModal() {
    this.setState({showModal: false});
  }

  onEditRecipient({target}) {
  	let $name = $('#inputNewRecipientName').val();
  	let $email = $('#inputNewRecipientEmail').val();
  	let $teamplateName = $('#newTemplate option:selected').text();

  	if ($name.length === 0) {
  		this.props.setAlert({
  			message: 'Please enter valid name',
  			type: 'info'
  		});

  		return;
  	}

  	if ($email.length === 0) {
  		this.props.setAlert({
  			message: 'Please enter valid email',
  			type: 'info'
  		});

  		return;
  	}

  	if ($teamplateName === null || ~$teamplateName.indexOf('Template')) {
  		this.props.setAlert({
  			message: 'Please choose a template',
  			type: 'info'
  		});
  		
  		return;
  	}

  	this.props.toggleLoadIcon(target, 'Save');

  	$.ajax({
  		type: 'PUT',
			url: `${this.props.source}/campgains/${localStorage.getItem('selectCampgainId')}`,
			data: JSON.stringify({
				id: this.props.recipient.id,
				name: $name,
				email: $email,
				templateName: $teamplateName,
				campgainId: parseInt(localStorage.getItem('selectCampgainId'))
			}),

			contentType: "application/json",

			success: function() {
				this.props.setAlert({
					message: 'Success!',
					type: 'success'
				});

		  	this.props.toggleLoadIcon(target, 'Save');
		  	this.props.loadRecipients();
				this.closeModal();
			}.bind(this)
  	});
  }

	render() {
		let { name, email, templateName } = this.props.recipient;

		return (
      <div class="btn-group">
        <Button {...this.props.buttonProps} onClick={this.showModal.bind(this)}>
          {this.props.children}
        </Button>

        <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.children}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          	<div class="form-horizontal">
	            <div class="form-group">
	              <label for="inputNewRecipientName" class="col-sm-2 control-label">Name</label>
	              <div class="col-sm-10">
	                <input type="text" class="form-control" id="inputNewRecipientName" defaultValue={name} placeholder="Input new name.." />
	              </div>
	            </div>

	            <div class="form-group">
	              <label for="inputNewRecipientEmail" class="col-sm-2 control-label">Email</label>
	              <div class="col-sm-10">
	                <input type="email" class="form-control" id="inputNewRecipientEmail" defaultValue={email} placeholder="Input new name.." />
	              </div>
	            </div>

	             <div class="form-group">
	              <label for="inputCampName" class="col-sm-2 control-label">Template</label>
	              <div class="col-sm-10">
	                <TemplatesChooserContainer templates={this.props.templates} selectName="newTemplate" defaultValue={templateName}/>
	              </div>
	            </div>
	          </div>
          </Modal.Body>
          <Modal.Footer>
              <Button onClick={this.onEditRecipient.bind(this)} class="btn btn-success">Save</Button>
              <Button onClick={this.closeModal.bind(this)} class="btn btn-danger">Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
		)
	}
}

ListBtnEditRecipient.propTypes = {
	recipient: React.PropTypes.object,
	defTemplate: React.PropTypes.string,
	children: React.PropTypes.string,
	templates: React.PropTypes.array,
};