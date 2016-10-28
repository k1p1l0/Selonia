import React from 'react';

import { Button, Modal } from 'react-bootstrap';

import auth from '../auth';

export default class TemplateEditBtn extends React.Component {
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

  onEditRecipient(id, name) {
  	let $name = $('#inputNewRecipientName').val();

  	if ($name.length === 0) {
  		this.props.setAlert({
  			message: 'Please enter valid name',
  			type: 'info'
  		});

  		return;
  	}

  	$.ajax({
  		type: 'PUT',
			url: `${this.props.source}/templates`,
			data: JSON.stringify({
				id: id,
				name: $name,
        oldname: name
			}),

			contentType: "application/json",
      crossDomain: true,

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function() {
				this.props.setAlert({
					message: 'Success!',
					type: 'success'
				});

		  	this.props.loadTemplates();
				this.closeModal();
			}.bind(this),

      error: function() {
        console.log('Some trouble with token!');

        auth.logout();
        location.reload();
      }
  	});
  }

	render() {
		let { name, id } = this.props.data;

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
	                <input type="text" class="form-control" id="inputNewRecipientName" defaultValue={name} placeholder={"Input new name.."} />
	              </div>
	            </div>

	          </div>
          </Modal.Body>
          <Modal.Footer>
              <Button onClick={this.onEditRecipient.bind(this, id, name)} class="btn btn-success">Edit</Button>
              <Button onClick={this.closeModal.bind(this)} class="btn btn-danger">Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
		)
	}
}

TemplateEditBtn.propTypes = {
	recipient: React.PropTypes.object,
	children: React.PropTypes.string,
	templates: React.PropTypes.array,
};