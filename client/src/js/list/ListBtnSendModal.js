import React from 'react';

import { Button, Modal, Popover, OverlayTrigger } from 'react-bootstrap';

import TemplatesChooserContainer from '../components/TemplatesChooserContainer';

import auth from '../auth';

export default class ListBtnSendModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      disabledTemplate: false,
      isStarted: false,
      step: 5,
      howMatch: 0,
      successCounter: 0
    };
  }

  showModal() {
    if (this.props.getRecipients.length === 0) {
      this.props.setAlert({message:'Please wait until recipients will loaded. Thank you!', type:'info'});

      return;
    }
    let length = this.props.getRecipients.length;

    this.setState({showModal: true});
    this.setState({howMatch: Math.ceil(length / this.state.step)});
  }

  closeModal() {
    this.setState({showModal: false});
    this.setState({howMatch: 0});
    this.setState({isStarted: false});
    this.setState({successCounter: 0});
    this.setState({disabledTemplate: false});
  }

  changeBox() {
    this.setState({disabledTemplate: !this.state.disabledTemplate});
  }

  sendEmails({target}) {
     let $templateId = $('#globalTemplate option:selected').val(),
        $checkOwnTemplate = $('#ownTemplate').prop('checked'),
        $introduceText = $('#introduceText').val(),
        $subject = $('#subject').val(),
        $email = $('#inputEmail').val();

    this.setState({howMatch: 0});
    this.setState({isStarted: false});
    this.setState({disabledTemplate: false});

    this.setState({successCounter: 0}, function() {
      if (!this.props.getRecipients.length) {

        this.props.setAlert({message:'There are no recipients in the list', type:'info'});
        
        return;
      }

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

      if ($templateId === 'def' && !$checkOwnTemplate) {
        this.props.setAlert({message:'Please choose a template', type:'info'});

        $('#globalTemplate').closest( ".form-group" ).addClass('has-warning');
        return;
      }

      this.props.toggleLoadIcon(target, 'Send')

      this.setState({'isStarted': true});

      let length = this.props.getRecipients.length;
      let step = this.state.step;
      let recipientsCopy = Object.assign([], this.props.getRecipients);

      this.setState({howMatch: Math.ceil(length / this.state.step)});

      do {
        let chopedRecipients = recipientsCopy.splice(0, step);

        length -= step;

        this.createPostRequest({
          from: `${$introduceText} <${$email}@${this.props.getDomain}`,
          subject: $subject,
          ownTemplate: $checkOwnTemplate,
          templateId: $templateId,
          recipients: chopedRecipients,
          target
        });
       
      } while(length > 0);
    }.bind(this));
  
  }

  createPostRequest(event) {
    $.ajax({
      type: 'POST',
      url: `${this.props.source}/campgains/${this.props.getCampgainId}/send`,
      data: JSON.stringify(event),
      contentType: "application/json",
      crossDomain: true,
      timeout: 0, //Set your timeout value in milliseconds or 0 for unlimited

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", auth.getToken());
      },

      success: function(data) {
        if (data === null) {
          this.props.setAlert({message: 'Something is going wrong..', type: 'error'});

          return;
        }

        if (!data.errorMessage) {
          this.setState({'successCounter': this.state.successCounter+=1});

          if (this.state.successCounter === this.state.howMatch) {
            this.props.setAlert({message: 'Emails are successfully send', type: 'success'});
            this.props.toggleLoadIcon(event.target, 'Send');
          }
        } else {
          this.props.setAlert({message: data.errorMessage, type: 'error'});
        }

      }.bind(this),

      error: function(data) {
        console.log('Some trouble with token!');
        console.log(data);

        // auth.logout();
        // location.reload();
      }
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


    let formulaPercent = Math.ceil((this.state.successCounter * 100) / this.state.howMatch);

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
              <label for="inputEmail3" class="col-sm-2 control-label">From</label>
              <div class="col-sm-10">
               <div class="input-group">
                  <input type="text" onChange={this.onChangeDeleteClassWarnings.bind(this)} class="form-control" id="introduceText" placeholder="Introduce text" required/>
                  <input type="text" onChange={this.onChangeDeleteClassWarnings.bind(this)} class="form-control" id="inputEmail" placeholder="noreply" required/>
                  <OverlayTrigger overlay={PopoverDomain}><p class="input-group-addon form-control-static">@{this.props.getDomain}</p></OverlayTrigger>
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
                <TemplatesChooserContainer onChange={this.onChangeDeleteClassWarnings.bind(this)} selectName="globalTemplate" templates={this.props.templates} disabled={this.state.disabledTemplate} placeholder="Global template" />
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
              { this.state.isStarted && (

                <div style={{'float':'left', 'textAlign':'left'}}>
                  { this.state.howMatch === this.state.successCounter ? (<div class="text-success">Thank you! Now you can close current window</div>): (<div class="text-info">Please don't close current window</div>) }
                  <div class="progress">
                    <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow={this.state.successCounter} aria-valuemin="0" aria-valuemax={this.state.howMatch} style={{minWidth: '2em', width: `${formulaPercent}%`}}>
                      {formulaPercent}%
                    </div>
                  </div>

                  <div>In one request will be <span class="label label-info">{this.state.step}</span> or less emails. </div>
                  <div>Will be send <span class="label label-info">{this.state.howMatch}</span> requests.</div>
                  <div>Successfully send to lambda <span class="label label-success">{this.state.successCounter}</span> requests</div>


                  <div style={{marginTop: '20px'}} class="text-info">More information you can get in the logs section</div>

                </div>
              )}

              <Button onClick={this.sendEmails.bind(this)} class="btn btn-success">Send</Button>
              <Button onClick={this.closeModal.bind(this)} class="btn btn-danger">Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}