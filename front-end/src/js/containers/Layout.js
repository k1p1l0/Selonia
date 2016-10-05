import React from "react";
import AlertContainer from 'react-alert';

import Navbar from './Navbar';
import Panel from './Panel/Panel';
import ListContainer from './List/List';

export default class LayoutContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			campgains: [],
			domains: [],
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

	loadDomains() {
		$.ajax({
			type: 'GET',
			url: `${this.props.source}/domains`,

			success: function(data) {
				this.setState({
					domains: data.Items
				});
			}.bind(this)
		});
	}
	
  createDomain({name}) {
  	if (!name.length) {
  		this.setAlert({ 
  			message: 'You should enter domain name',
  			type: 'info'
  		});

  		return;
  	}

    $.ajax({
      type: 'POST',
			url: `${this.props.source}/domains`,
			data: JSON.stringify({
				name
			}),
			contentType: "application/json",

			success: function(data) {				
				this.setState({
					domains: this.state.domains.concat(data)
				});

				this.setAlert({
	  			message: 'Domain is successfully added  - ' + data.name,
	  			type: 'success'
  			});

			}.bind(this)
    });
  }

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/campgains`,

			success: function(data) {
				this.setState({
					campgains: data.Items
				});
			}.bind(this)
    });
  }

  createCampgain({name}) {
  	if (!name.length) {
  		this.setAlert({ 
  			message: 'You should enter campaign name',
  			type: 'info'
  		});

  		return;
  	}

    $.ajax({
      type: 'POST',
			url: `${this.props.source}/campgains`,
			data: JSON.stringify({
				name
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
		this.setState({selectedCampgainId: id});
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
				source={this.props.source} 
				createCampgain={this.createCampgain.bind(this)} 
				setSelectedCampgainId={this.setSelectedCampgainId.bind(this)}
				stopIntervalCampgainLoad={this.stopIntervalCampgainLoad.bind(this)}
				startIntervalCampgainLoad={this.startIntervalCampgainLoad.bind(this)}
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
	    			getCampgains={this.props.campgains} 
	    			getTemplates={this.props.getTemplates} 
	    			getCampgainId={this.props.getCampgainId} 
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

