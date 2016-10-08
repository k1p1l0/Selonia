import React from 'react';

import ListHeader from './ListHeader';
import ListBody from './ListBody';

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

  createRecipientFromClient({id, name, email, templateName}) {
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

			success: function(data) {
				if (!data.errorMessage) {
					this.props.setAlert({message: 'Recipient is successfully added ', type: 'success'});
					this.loadRecipients();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
			}.bind(this)
    });
  }

  deleteRecipient(id) {
  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/campgains/${this.props.getCampgainId}`,
  		data: JSON.stringify({
  			id
  		}),
  		contentType: "application/json",

  		success: function(data) {
  			if (!data.errorMessage) {
					this.props.setAlert({message: 'Recipient is successfully deleted ', type: 'success'});
					this.loadRecipients();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
  		}.bind(this)
  	});
  }

  deleteList() {
  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/campgains`,
  		data: JSON.stringify({
  			id: this.props.getCampgainId,
  			deleteCampgain: false
  		}),
  		contentType: "application/json",

  		success: function(data) {
  			if (!data.errorMessage) {
					this.props.setAlert({message: 'List is successfully deleted', type: 'success'});
					this.loadRecipients();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
  		}.bind(this)
  	});
	}

	cleanCampgainTemp() {
		$('.loader').show();
		$('#main-table').hide();
		
		this.props.setSelectedCampgainId(null);
		localStorage.removeItem('selectCampgainId');
		localStorage.removeItem('selectCampgainName');
		$('select[name="campaign"]').val('def');
	  this.props.startIntervalCampgainLoad();
	}

	deleteCampgain() {
  	$.ajax({
  		type: 'DELETE',
  		url: `${this.props.source}/campgains`,
  		data: JSON.stringify({
  			id: this.props.getCampgainId,
  			deleteCampgain: true
  		}),
  		contentType: "application/json",

  		success: function(data) {
  			if (!data.errorMessage) {
					this.props.setAlert({message: 'Campgain is successfully deleted', type: 'success'});
					this.cleanCampgainTemp();
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
  		}.bind(this)
  	});
	}

	render() {
		return <List 
			createNew={this.createRecipientFromClient.bind(this)}
			setSelectedCampgainId={this.props.setSelectedCampgainId}
			templates={this.props.templates}
			setAlert={this.props.setAlert}
			getRecipients={this.props.recipients} 
			getCampgainId={this.props.getCampgainId}
			changeDomainEmail={this.props.changeDomainEmail}
			getCampgains={this.props.getCampgains} 
			getDomain={this.props.getDomain}
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
			$('.loader').show();
			$('#main-table').hide();
		}

		return (
			<div class="col-lg-8">
				<div class="panel panel-default">
					<ListHeader 
						setSelectedCampgainId={this.props.setSelectedCampgainId} 
						loadRecipients={this.props.loadRecipients}
						setAlert={this.props.setAlert}
						deleteList={this.props.deleteList} 
						templates={this.props.templates}
						source={this.props.source} 
						getCampgainId={this.props.getCampgainId}
						deleteCampgain={this.props.deleteCampgain}
						getDomain={this.props.getDomain}
						getCampgains={this.props.getCampgains} 
						getRecipients={this.props.getRecipients} />

					<div class="loader">
					</div>

					<ListBody 
						source={this.props.source} 
						templates={this.props.templates}
						deleteRecipient={this.props.deleteRecipient} 
						createNewRecipient={this.props.createNew} 
						getRecipients={this.props.getRecipients} />
				</div>
			</div>
		)
	}
}