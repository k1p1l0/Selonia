import React from "react";
import AlertContainer from 'react-alert';

import Panel from '../panel/Panel';
import List from '../list/List';

export default class LayoutContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			campgains: [],
			templates: [],
			recipients: [],
			domain: '',
			selectedCampgainId: localStorage.getItem('selectCampgainId'),
			selectedCampgainName: localStorage.getItem('selectCampgainName'),
			campgainTimerId: null,
			templateTimerId: null,
			recipientsTimerId: null
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

			success: function(data) {
				//data.Items.length !== this.state.recipients.length && 
				if (!this.UnMount) {
					this.setState({recipients: data.Items}, function() {
						this.stopIntervalRecipientsLoad();
					}.bind(this));
				}
				
				$('.loader').hide();
				$('#main-table').show();
			}.bind(this),

			error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
    });
  }

	loadTemplates() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/templates`,

			success: function(data) {
				if (data.Items.length !== this.state.templates.length && !this.UnMount) {
					this.setState({templates: data.Items}, function() {
					this.stopIntervalTemplateLoad();
					}.bind(this));
				}
			}.bind(this)
    });
  }

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/campgains`,

			success: function(data) {
				if (data.Items.length !== this.state.campgains.length && !this.UnMount || this.editCampaign) {
					this.setState({campgains: data.Items}, function() {
						this.stopIntervalCampgainLoad();
						this.changeDomainEmail();
						this.editCampaign = false;
					}.bind(this));
				}
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

  createCampgain({name, domain, target}) {
  	if (!name.length) {
  		this.setAlert({ 
  			message: 'Please enter campaign name',
  			type: 'info'
  		});

  		return;
  	}

  	 if (~domain.indexOf('Domain')) {
  		this.setAlert({ 
  			message: 'Please choose domain name',
  			type: 'info'
  		});

  		return;
  	}

  	this.toggleLoadIcon(target, 'Create');

    $.ajax({
      type: 'POST',
			url: `${this.props.source}/campgains`,
			data: JSON.stringify({
				name,
				domain
			}),
			contentType: "application/json",

			success: function(data) {				
				this.setState({
					campgains: this.state.campgains.concat(data)
				});

				this.setAlert({
	  			message: 'Campaign is successfully added  - ' + data.name,
	  			type: 'success'
  			});

  			this.toggleLoadIcon(target, 'Create');

			}.bind(this)
    });
  }

	componentWillMount() {
		this.UnMount = false;
		this.loadCompgain();
		this.loadTemplates();
		this.loadRecipients();
	}

	componentWillUnmount() {
		this.UnMount = true;
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
		let recipientsTimerId = setInterval(this.loadRecipients.bind(this), 1000);
		this.setState({recipientsTimerId});
	}

	startIntervalCampgainLoad() {
		let campgainTimerId = setInterval(this.loadCompgain.bind(this), 1000);
		this.setState({campgainTimerId});
	}

	startIntervalTemplateLoad() {
		let templateTimerId = setInterval(this.loadTemplates.bind(this), 1000);
		this.setState({templateTimerId});
	}

	setSelectedCampgainId(id) {
		this.setState({selectedCampgainId: id}, function() {
			this.changeDomainEmail();
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
				message={this.state.message}
				showAlert={this.state.alert}
				getCampgainId={this.state.selectedCampgainId} 
				getDomain={this.state.domain}
				source={this.props.source} 
				toggleLoadIcon={this.toggleLoadIcon.bind(this)}
				createCampgain={this.createCampgain.bind(this)} 
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

	    		<Panel 
	    			createCampgain={this.props.createCampgain}
	    			startIntervalTemplateLoad={this.props.startIntervalTemplateLoad}
						startIntervalRecipientsLoad={this.props.startIntervalRecipientsLoad} 
	    			source={this.props.source} 
	    			setAlert={this.props.setAlert} 
	    			toggleLoadIcon={this.props.toggleLoadIcon}
	    			templates={this.props.templates} 
	    			getTemplates={this.props.getTemplates}/>

					{this.props.children}
			</div>
    )	
  }
}
