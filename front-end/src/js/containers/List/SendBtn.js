import React from 'react';

import { Button, Modal, Popover, OverlayTrigger } from 'react-bootstrap';

import TemplatesChooserContainer from '../../components/TemplatesChooserContainer';

export default class SendBtn extends React.Component {
  constructor() {
    super();

    this.state = {
      showModal: false,
      disabledTemplate: false
    };
  }

  showModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  changeBox() {
    this.setState({disabledTemplate: !this.state.disabledTemplate});
  }

  sendEmails() {
     let $templateName = $('#globalTemplate option:selected').text(),
        $checkOwnTemplate = $('#ownTemplate').prop('checked'),
        $introduceText = $('#introduceText').val(),
        $subject = $('#subject').val(),
        $email = $('#inputEmail').val();

    if (!$introduceText) {
      this.props.setAlert({message:'Please enter an introduce text', type:'info'});

      $("#introduceText").closest( ".form-group" ).addClass('has-warning');
      return;
    }

    if (!$email) {
      this.props.setAlert({message:'Please enter an email', type:'info'});

      $("#inputEmail").closest( ".form-group" ).addClass('has-warning');
      return;
    }

    if (!$subject) {
      this.props.setAlert({message:'Please enter a subject', type:'info'});

      $("#subject").closest( ".form-group" ).addClass('has-warning');
      return;
    }

    if (~$templateName.indexOf('Global') && !$checkOwnTemplate) {
      this.props.setAlert({message:'Please choose a template', type:'info'});

      $('#globalTemplate').closest( ".form-group" ).addClass('has-warning');
      return;
    }

    this.createPostRequest({
      from: `${$introduceText} <${$email}@txm.net>`,
      subject: $subject,
      ownTemplate: $checkOwnTemplate,
      template: $templateName,
      recipients: this.props.getRecipients
    }, function() {
      this.closeModal();
    }.bind(this));
  }

  createPostRequest(event, callback) {
    $.ajax({
      type: 'POST',
      url: `${this.props.source}/campgains/${this.props.getCampgainId}/send`,
      data: JSON.stringify(event),
      contentType: "application/json",
      success: function(data) {
        if (!data.errorMessage) {
          this.props.setAlert({message: 'Emails is successfully sent', type: 'success'});
          callback();
        } else {
          this.props.setAlert({message: data.errorMessage, type: 'error'});
        }
      }.bind(this)
    });
  }

  onChangeDeleteClassWarnings(e) {
    let id = e.target.id;

    $('#' + id).closest( ".form-group" ).removeClass('has-warning');
  }

  render() {
    const PopoverDomain = (
      <Popover id="modal-tooltip">
        You can change this domain go to the settings
      </Popover>
    );

    const PopoverSubject = (
      <Popover id="modal-tooltip">
        Please input the main topic of the email
      </Popover>
    );

    return (
      <div class="btn-group">
        <button {...this.props.buttonProps} onClick={this.showModal.bind(this)}>
          Send emails
        </button>

        <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm sending</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-horizontal">
            <div class="form-group">
              <label for="inputEmail3" class="col-sm-2 control-label">From</label>
              <div class="col-sm-10">
               <div class="input-group">
                  <input type="text" onChange={this.onChangeDeleteClassWarnings.bind(this)} class="form-control" id="introduceText" placeholder="Introduce text" required/>
                  <input type="text" onChange={this.onChangeDeleteClassWarnings.bind(this)} class="form-control" id="inputEmail" placeholder="noreply" required/>
                  <OverlayTrigger overlay={PopoverDomain}><p class="input-group-addon form-control-static">@boadens.com</p></OverlayTrigger>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="inputPassword3" class="col-sm-2 control-label">Subject</label>
              <div class="col-sm-10">
                <OverlayTrigger overlay={PopoverSubject}><input type="text" onChange={this.onChangeDeleteClassWarnings.bind(this)} class="form-control" id="subject" placeholder="Input subject.."/></OverlayTrigger>
              </div>
            </div>

            <div class="form-group">
              <label for="inputPassword3" class="col-sm-2 control-label">Template</label>
              <div class="col-sm-10">
                <TemplatesChooserContainer onChange={this.onChangeDeleteClassWarnings.bind(this)} selectName="globalTemplate" source={this.props.source} disabled={this.state.disabledTemplate} placeholder="Global template" />
              </div>
            </div>

             <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                  <div class="checkbox">
                    <label>
                      <input id="ownTemplate" type="checkbox" onChange={this.changeBox.bind(this)} /> Sending by own template
                    </label>
                  </div>
                </div>
              </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
              <Button onClick={this.closeModal.bind(this)} class="btn btn-danger">Close</Button>
              <Button onClick={this.sendEmails.bind(this)} class="btn btn-success">Send</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}