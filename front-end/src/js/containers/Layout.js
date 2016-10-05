import React from "react";
import AlertContainer from 'react-alert';

import Panel from './Panel/Panel';
import ListContainer from './List/ListContainer';

export default class LayoutContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			campgains: [],
			domain: '',
			selectedCampgainId: localStorage.getItem('selectCampgainId'),
			selectedCampgainName: localStorage.getItem('selectCampgainName'),
			campgainTimerId: null
		};

		this.alertOptions = {
      offset: 0,
      position: 'top left',
      theme: 'light',
      time: 10000,
      transition: 'scale'
    };
	}

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/campgains`,

			success: function(data) {
				this.setState({
					campgains: data.Items
				}, function() {
					this.changeDomainEmail();
				}.bind(this));
			}.bind(this)
    });
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

  createCampgain({name, domain}) {
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

			}.bind(this)
    });
  }

	componentWillMount() {
		this.loadCompgain();
	}

	startIntervalCampgainLoad() {
		let campgainTimerId = setInterval(this.loadCompgain.bind(this), 2000);
		this.setState({campgainTimerId});

		setTimeout(this.stopIntervalCampgainLoad.bind(this), 5000);
	}

	stopIntervalCampgainLoad() {
		if (this.state.campgainTimerId) {
			clearTimeout(this.state.campgainTimerId);
		}
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
				message={this.state.message}
				showAlert={this.state.alert}
				getCampgainId={this.state.selectedCampgainId} 
				getDomain={this.state.domain}
				source={this.props.source} 
				createCampgain={this.createCampgain.bind(this)} 
				setSelectedCampgainId={this.setSelectedCampgainId.bind(this)}
				stopIntervalCampgainLoad={this.stopIntervalCampgainLoad.bind(this)}
				startIntervalCampgainLoad={this.startIntervalCampgainLoad.bind(this)}
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
    	<div class="container content">
				<div class="row">
	    		<ListContainer 
	    			source={this.props.source} 
	    			templates={this.props.templates}
	    			changeDomainEmail={this.props.changeDomainEmail}
	    			getCampgains={this.props.campgains} 
	    			getTemplates={this.props.getTemplates} 
	    			getCampgainId={this.props.getCampgainId} 
	    			getDomain={this.props.getDomain}
	    			setSelectedCampgainId={this.props.setSelectedCampgainId}
	    			stopIntervalCampgainLoad={this.props.stopIntervalCampgainLoad}
	    			startIntervalCampgainLoad={this.props.startIntervalCampgainLoad}
	    			setAlert={this.props.setAlert} />

	    		<Panel 
	    			createCampgain={this.props.createCampgain}
	    			source={this.props.source} 
	    			setAlert={this.props.setAlert} 
	    			templates={this.props.templates} 
	    			getTemplates={this.props.getTemplates}/>
				</div>
				{this.props.children}
			</div>	
    )	
  }
}

