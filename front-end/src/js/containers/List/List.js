import React from 'react';

import ListHeader from './ListHeader';
import ListBody from './ListBody';

export default class ListContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recipients: [],	
		};
	}

	loadRecipients(newId) {
		var URL = (newId > 0) ? `${this.props.source}/campgains/${newId}`: `${this.props.source}/campgains/${this.props.getCampgainId}`

		if (~URL.indexOf('null') || this.props.getCampgainId === null) {
			return;
		}

    $.ajax({
      type: 'GET', 
			url: URL,

			success: function(data) {
				if (data.Items) {
					if (data.Items.length === 0) {
						this.setState({recipients: []}, function() {
							this.forceUpdate();
						}.bind(this));
					} else {
						this.setState({recipients: data.Items});
					}

					$('.loader').hide();
					$('#main-table').show();
				}
			}.bind(this),

			error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
    });
  }

  createRecipientFromClient({id, name, email, templateName}) {
  	// this.setRecipients({id, name, email, templateName});

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
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
				this.loadRecipients();
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
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
				this.loadRecipients();
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
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
  		}.bind(this)
  	});
	}

	deleteCampgain() {
		localStorage.removeItem('selectCampgainId');
		localStorage.removeItem('selectCampgainName');

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
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
  		}.bind(this)
  	});
	}

  componentWillMount() {
  	this.loadRecipients();
  	
  	setInterval(this.loadRecipients.bind(this), 1500);
  }

	setRecipients(newOne) {
		this.setState({recipients: this.state.recipients.concat(newOne)});
	}

	render() {
		return <List 
			getRecipients={this.state.recipients} 
			source={this.props.source} 
			createNew={this.createRecipientFromClient.bind(this)}
			setSelectedCampgainId={this.props.setSelectedCampgainId}
			getCampgains={this.props.getCampgains} 
			deleteRecipient={this.deleteRecipient.bind(this)}
			deleteList={this.deleteList.bind(this)}
			deleteCampgain={this.deleteCampgain.bind(this)} />
	}
}

class List extends React.Component {
	render() {
		return (
			<div class="col-lg-8">
				<div class="panel panel-default">
					<ListHeader 
						setSelectedCampgainId={this.props.setSelectedCampgainId} 
						deleteList={this.props.deleteList} 
						deleteCampgain={this.props.deleteCampgain}
						getCampgains={this.props.getCampgains} />

					<div class="loader">
					</div>

					<ListBody 
						source={this.props.source} 
						deleteRecipient={this.props.deleteRecipient} 
						createNewRecipient={this.props.createNew} 
						getRecipients={this.props.getRecipients} />
				</div>
			</div>
		)
	}
}