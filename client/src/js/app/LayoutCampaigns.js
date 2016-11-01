import React from "react";
import AlertContainer from 'react-alert';

import Panel from '../panel/Panel';
import PanelRecipients from '../panel/PanelRecipients';

import List from '../list/List';

import auth from '../auth';

export default class LayoutContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			campgains: [],
			templates: [],
			recipients: [],
			totalAmoutRecipients: 0,
			domain: '',
			selectedCampgainId: localStorage.getItem('selectCampgainId'),
			selectedCampgainName: localStorage.getItem('selectCampgainName'),
			campgainTimerId: 0,
			templateTimerId: 0,
			recipientsTimerId: 0
		};

		this.alertOptions = {
      offset: 0,
      position: 'top left',
      theme: 'light',
      time: 10000,
      transition: 'scale'
    };
	}

	loadRecipients(newId) {
		var URL = (newId > 0) ? `${this.props.source}/campgains/${newId}`: `${this.props.source}/campgains/${this.state.selectedCampgainId}`

		if (~URL.indexOf('null') || this.state.selectedCampgainId === null) {
			return;
		}

    $.ajax({
      type: 'GET', 
			url: URL,
			crossDomain: true,
			headers: { 
      	'Authorization':  auth.getToken()
      },

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {
				if (!this.UnMount || this.editCampaign) {
				this.setState({totalAmoutRecipients: data.count});
					this.setState({recipients: data.Items}, function() {
						// if (data.Items.length > 0) {
							this.setState({totalAmoutRecipients: data.count});
						// 	this.stopIntervalRecipientsLoad();
						// } else {
						// 	this.setState({totalAmoutRecipients: 0});
						// }
					}.bind(this));
				}
				
				$('.loader').hide();
				$('#main-table').show();
			}.bind(this),

			error: function() {
				this.setAlert({
          message: 'Bad connection....try again or relogin',
					type: 'info'
				});
				// auth.logout();
				// location.reload();
			}.bind(this)
    });
  }

	loadTemplates() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/templates`,
			crossDomain: true,
			headers: { 
      	'Authorization':  auth.getToken()
      },

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {
				if (data.Items.length !== this.state.templates.length && !this.UnMount) {
					this.setState({templates: data.Items}, function() {
					this.stopIntervalTemplateLoad();
					}.bind(this));
				}
			}.bind(this),

			error: function() {
				this.setAlert({
          message: 'Bad connection....try again or relogin',
					type: 'info'
				});
				// auth.logout();
				// location.reload();
			}.bind(this)
    })
  }

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/campgains`,

			crossDomain: true,
			headers: { 
            'Authorization':  auth.getToken()
      },

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {
				if (data.Items.length !== this.state.campgains.length && !this.UnMount || this.editCampaign) {
					this.setState({campgains: data.Items}, function() {
						this.stopIntervalCampgainLoad();
						this.changeDomainEmail();
						this.editCampaign = false;
					}.bind(this));
				}
			}.bind(this),

			error: function(data) {
				this.setAlert({
          message: 'Bad connection....try again or relogin',
					type: 'info'
				});
				// auth.logout();
				// location.reload();
			}.bind(this)
		});
  }

  toggleLoadIcon(target, text) {
  	let width = $(target).width();

  	if ($(target).children()[0] === undefined) {
  		$(target).prop('disabled', true);
  		$(target).html(`<div style="width: ${width}px" class="glyphicon glyphicon-repeat gly-spin"></div>`);
  	} else {
  		$(target).prop('disabled', false);
	  	$(target).html(text);
  	}
  }

  changeDomainEmail() {
  	this.setState({domain: this.getDomainEmail()});
  }

 	getDomainEmail() {
    return this.state.campgains.filter(function (campgain) {
      return campgain.id === +this.state.selectedCampgainId;
    }.bind(this)).map(function (campgain) {
      return campgain.domain.split('.').splice(1).join('.');
    }).pop();
  }

  campaignWasEdited() {
  	this.editCampaign = true;
  	this.loadCompgain();
  }

	componentWillMount() {
		this.UnMount = false;
		this.loadTemplates();
		this.loadCompgain();
		this.loadRecipients();
	}

	componentWillUnmount() {		
		this.UnMount = true;
		this.stopIntervalRecipientsLoad();
		this.stopIntervalCampgainLoad();
		this.stopIntervalTemplateLoad();
		this.setState({totalAmoutRecipients: 0});
	}

	stopIntervalRecipientsLoad() {
		this.state.recipientsTimerId && clearInterval(this.state.recipientsTimerId);
	}

	stopIntervalCampgainLoad() {
		this.state.campgainTimerId && clearInterval(this.state.campgainTimerId);
	}

	stopIntervalTemplateLoad() {
		this.state.templateTimerId && clearInterval(this.state.templateTimerId);
	}

	startIntervalRecipientsLoad() {
		this.UnMount = true;
		this.stopIntervalRecipientsLoad();

		this.UnMount = false;
		let recipientsTimerId = setInterval(this.loadRecipients.bind(this), 3000);
		this.setState({recipientsTimerId});
		// }
	}

	startIntervalCampgainLoad() {
		let campgainTimerId = setInterval(this.loadCompgain.bind(this), 2000);
		this.setState({campgainTimerId});
	}

	startIntervalTemplateLoad() {
		// if (this.state.templateTimerId > 0) { 
			let templateTimerId = setInterval(this.loadTemplates.bind(this), 3000);
			this.setState({templateTimerId});
		// }
	}

	setSelectedCampgainId(id) {
		this.setState({selectedCampgainId: id}, function() {
			this.changeDomainEmail();
			this.loadRecipients();
		}.bind(this));
	}

	setAlert({message, type}) {
    msg.show(message, {
      type
    });
  }

	render() {
		return (
			<Layout 
				campgains={this.state.campgains} 
				templates={this.state.templates}
				recipients={this.state.recipients}
				totalAmoutRecipients={this.state.totalAmoutRecipients}
				message={this.state.message}
				showAlert={this.state.alert}
				getCampgainId={this.state.selectedCampgainId} 
				getDomain={this.state.domain}
				source={this.props.source} 
				toggleLoadIcon={this.toggleLoadIcon.bind(this)}
				loadRecipients={this.loadRecipients.bind(this)}
				campaignWasEdited={this.campaignWasEdited.bind(this)}
				setSelectedCampgainId={this.setSelectedCampgainId.bind(this)}
				stopIntervalCampgainLoad={this.stopIntervalCampgainLoad.bind(this)}
				startIntervalCampgainLoad={this.startIntervalCampgainLoad.bind(this)}
				startIntervalTemplateLoad={this.startIntervalTemplateLoad.bind(this)}
				startIntervalRecipientsLoad={this.startIntervalRecipientsLoad.bind(this)}
				changeDomainEmail={this.changeDomainEmail.bind(this)}
				setAlert={this.setAlert.bind(this)}>
				<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
			</Layout>
		)
	}
}

class Layout extends React.Component {
  render() {
    return (
    		<div>
	    		<List 
	    			source={this.props.source} 
	    			templates={this.props.templates}
	    			recipients={this.props.recipients}
	    			loadRecipients={this.props.loadRecipients}
	    			totalAmoutRecipients={this.props.totalAmoutRecipients}
	    			toggleLoadIcon={this.props.toggleLoadIcon}
	    			changeDomainEmail={this.props.changeDomainEmail}
	    			getCampgains={this.props.campgains} 
	    			getTemplates={this.props.getTemplates} 
	    			getCampgainId={this.props.getCampgainId} 
	    			getDomain={this.props.getDomain}
	    			campaignWasEdited={this.props.campaignWasEdited}
	    			setSelectedCampgainId={this.props.setSelectedCampgainId}
	    			stopIntervalCampgainLoad={this.props.stopIntervalCampgainLoad}
	    			startIntervalCampgainLoad={this.props.startIntervalCampgainLoad}
	    			startIntervalRecipientsLoad={this.props.startIntervalRecipientsLoad}
	    			setAlert={this.props.setAlert} />

	    		<Panel>
	    				<div class="col-lg-4">
								<PanelRecipients toggleLoadIcon={this.props.toggleLoadIcon} setAlert={this.props.setAlert} templates={this.props.templates} startIntervalRecipientsLoad={this.props.startIntervalRecipientsLoad} source={this.props.source} />
							</div>
	    		</Panel>

					{this.props.children}
			</div>
    )	
  }
}

