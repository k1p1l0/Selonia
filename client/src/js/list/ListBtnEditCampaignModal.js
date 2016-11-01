import React from 'react';

import { Button, Modal } from 'react-bootstrap';

import BucketsChooser from '../components/BucketsChooser';

import auth from '../auth';

export default class ListBtnCampaignModal extends React.Component {
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

  onEditCampaign({target}) {
  	let $name = $('#inputCampName').val();
  	let $domain = $('#newDomain').val();

  	if ($name.length === 0) {
  		this.props.setAlert({
  			message: 'Please enter valid name',
  			type: 'info'
  		});

  		return;
  	}

  	if ($domain === null || ~$domain.indexOf('Domain')) {
  		this.props.setAlert({
  			message: 'Please choose a template',
  			type: 'info'
  		});
  		
  		return;
  	}

  	this.props.toggleLoadIcon(target, 'Save');

  	$.ajax({
  		type: 'PUT',
  		url: `${this.props.source}/campgains`,
  		data: JSON.stringify({
  			id: this.props.getCampgainId,
  			name: $name,
  			domain: $domain
  		}),
			contentType: "application/json",
      crossDomain: true,

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function() {
				localStorage.setItem('selectCampgainName', $name);

				this.props.campaignWasEdited();
				this.props.setAlert({
					message: 'Success!',
					type: 'success'
				});

		  	this.props.toggleLoadIcon(target, 'Save');
				this.closeModal();
			}.bind(this),

      error: function() {
        this.props.setAlert({
          message: 'Bad connection....try again or relogin',
          type: 'info'
        });
      }.bind(this)
  	});
  }

	render() {
		const campaignName = localStorage.getItem('selectCampgainName');

		return (
			<div class="btn-group">
        <button {...this.props.buttonProps} onClick={this.showModal.bind(this)}>
          {this.props.children}
        </button>

        <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.children}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
	          <div class="form-horizontal">
	            <div class="form-group">
	              <label for="inputCampName" class="col-sm-2 control-label">Name</label>
	              <div class="col-sm-10">
	                <input type="text" class="form-control" id="inputCampName" defaultValue={campaignName} placeholder="Input new name.." />
	              </div>
	            </div>

	            <div class="form-group">
	              <label for="inputPassword3" class="col-sm-2 control-label">Domain</label>
	              <div class="col-sm-10">
					   			<BucketsChooser id="newDomain" defaultValue={'www.' + this.props.getDomain} source={this.props.source} />
	              </div>
	            </div>
	          </div>
          </Modal.Body>	
          <Modal.Footer>
              <Button onClick={this.onEditCampaign.bind(this)} class="btn btn-success">Save</Button>
              <Button onClick={this.closeModal.bind(this)} class="btn btn-danger">Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}

ListBtnCampaignModal.propTypes = {
  buttonProps: React.PropTypes.object,
  source: React.PropTypes.string,
  getDomain: React.PropTypes.string,
  getCampgainId: React.PropTypes.string,
  setAlert: React.PropTypes.func
};