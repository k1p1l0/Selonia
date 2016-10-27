import React from 'react';

import ListHeader from './ListHeader';
import ListBody from './ListBody';

import auth from '../auth';

export default class ListContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recipientsTimerId: null
		};
	}

	loadRecipients(newId) {
		this.props.startIntervalRecipientsLoad(newId);
  }

  toggleLoadIcon(target, text) {
  	this.props.toggleLoadIcon(target, text);
  }

  createRecipientFromClient({id, name, email, templateName, target}) {
  	this.toggleLoadIcon(target, 'Add');

  	 $.ajax({
     	type: 'POST',
			url: `${this.props.source}/campgains/${this.props.getCampgainId}`,
			data: JSON.stringify({
				"recipients": [{
					id,
					name,
					email,
					templateName,
					campgainId: parseInt(this.props.getCampgainId)
				}]
			}),
			contentType: "application/json",
      crossDomain: true,

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {
				if (!data.errorMessage) {
					this.props.setAlert({message: 'Recipient is successfully added ', type: 'success'});
					this.loadRecipients();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}

		  	this.toggleLoadIcon(target, 'Add');

			}.bind(this),

			error: function() {
        console.log('Some trouble with token!');

        auth.logout();
        location.reload();
      }
    });
  }

  deleteRecipient({id, target}) {
  	this.toggleLoadIcon(target, 'Delete'); 

  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/campgains/${this.props.getCampgainId}`,
  		data: JSON.stringify({
  			id
  		}),
  		contentType: "application/json",
  		crossDomain: true,

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

  		success: function(data) {
  			if (!data.errorMessage) {
					this.props.setAlert({message: 'Recipient is successfully deleted ', type: 'success'});
					this.loadRecipients();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
		  	this.toggleLoadIcon(target, 'Delete');
  		}.bind(this),

  		error: function() {
				console.log('Some trouble with token!');

				auth.logout();
				location.reload();
			}
  	});
  }

  deleteList({target}) {
  	this.toggleLoadIcon(target, 'Delete list');
  	
  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/campgains`,
  		data: JSON.stringify({
  			id: this.props.getCampgainId,
  			deleteCampgain: false
  		}),
  		contentType: "application/json",
			crossDomain: true,

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

  		success: function(data) {
  			if (!data.errorMessage) {
					this.props.setAlert({message: 'List is successfully deleted', type: 'success'});
					this.loadRecipients();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
  			this.toggleLoadIcon(target, 'Delete list');
  		}.bind(this),

  		error: function(data) {
  			console.log(data);
				// console.log('Some trouble with token!');
			},
  	});
	}

	cleanCampgainTemp() {
		// $('.loader').show();
		$('#main-table').hide();
		
		this.props.setSelectedCampgainId(null);
		localStorage.removeItem('selectCampgainId');
		localStorage.removeItem('selectCampgainName');
		$('select[name="campaign"]').val('def');
	  this.props.startIntervalCampgainLoad();
	}

	deleteCampgain({target}) {
		this.toggleLoadIcon(target, 'Delete campaign');
		
  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/campgains`,
  		data: JSON.stringify({
  			id: this.props.getCampgainId,
  			deleteCampgain: true
  		}),

  		contentType: "application/json",
  		crossDomain: true,

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      	request.setRequestHeader("Content-Type", "application/json");
      },

  		success: function(data) {
  			if (!data.errorMessage) {
					this.props.setAlert({message: 'Campgain is successfully deleted', type: 'success'});
					this.cleanCampgainTemp();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}

				this.toggleLoadIcon(target, 'Delete campaign');
  		}.bind(this),

  		error: function() {
				console.log('Some trouble with token!');

				// auth.logout();
				// location.reload();
			}
  	});
	}

	render() {
		return <List 
			setSelectedCampgainId={this.props.setSelectedCampgainId}
			templates={this.props.templates}
			setAlert={this.props.setAlert}
			campaignWasEdited={this.props.campaignWasEdited}
			getRecipients={this.props.recipients} 
			totalAmoutRecipients={this.props.totalAmoutRecipients}
			getCampgainId={this.props.getCampgainId}
			changeDomainEmail={this.props.changeDomainEmail}
			getCampgains={this.props.getCampgains} 
			getDomain={this.props.getDomain}
			createRecipientFromClient={this.createRecipientFromClient.bind(this)}
			toggleLoadIcon={this.toggleLoadIcon.bind(this)}
			loadRecipients={this.loadRecipients.bind(this)}
			deleteRecipient={this.deleteRecipient.bind(this)}
			deleteList={this.deleteList.bind(this)}
			deleteCampgain={this.deleteCampgain.bind(this)} 
			source={this.props.source} />
	}
}

class List extends React.Component {
	render() {
		if (this.props.getCampgainId === null) {
			// $('.loader').show();
			$('#main-table').hide();
		}

		return (
			<div class="col-lg-8">
				<div class="panel panel-default">
					<ListHeader 
						setSelectedCampgainId={this.props.setSelectedCampgainId} 
						totalAmoutRecipients={this.props.totalAmoutRecipients}
						campaignWasEdited={this.props.campaignWasEdited}
						loadRecipients={this.props.loadRecipients}
						setAlert={this.props.setAlert}
						deleteList={this.props.deleteList} 
						templates={this.props.templates}
						source={this.props.source} 
						getCampgainId={this.props.getCampgainId}
						deleteCampgain={this.props.deleteCampgain}
						getDomain={this.props.getDomain}
						toggleLoadIcon={this.props.toggleLoadIcon}
						getCampgains={this.props.getCampgains} 
						getRecipients={this.props.getRecipients} />

					<ListBody 
						source={this.props.source} 
						templates={this.props.templates}
						deleteRecipient={this.props.deleteRecipient} 
						toggleLoadIcon={this.props.toggleLoadIcon}
						setAlert={this.props.setAlert}
						loadRecipients={this.props.loadRecipients}
						createRecipientFromClient={this.props.createRecipientFromClient} 
						getRecipients={this.props.getRecipients} />
				</div>
			</div>
		)
	}
}

					// <div class="loader">
					// </div>