import React from "react";

import Alert from '../components/Alert';
import Navbar from './Navbar';
import Panel from './Panel';
import ListContainer from './List';

export default class LayoutContainer extends React.Component {
	constructor() {
		super();

		this.state = {
			campgains: [],
			templates: [],
			selectedCampgainId: localStorage.getItem('selectCampgainId'),
			selectedCampgainName: localStorage.getItem('selectedCampgainName'),
			message: '',
			alert: false
		};
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

  loadTemplates() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/templates`,

			success: function(data) {
				this.setState({
					templates: data.Items
				});
			}.bind(this)
    });
  }

  createCampgain({name}) {
    $.ajax({
      type: 'POST',
			url: `${this.props.source}/campgains`,
			data: JSON.stringify({
				name
			}),
			contentType: "application/json",

			success: function(data) {
				this.setState({
					campgains: this.state.campgains.concat(data),
					alert: true,
					message: 'Successfully added new campaign - ' + data.name
				});
			}.bind(this)
    });
  }

	componentWillMount() {
		setInterval(function() {
			this.loadCompgain();
			this.loadTemplates();
		}.bind(this), 1000)
	}

	setSelectedCampgainId(id) {
		this.setState({selectedCampgainId: id});
	}

	setAlert(message) {
		this.setState({
			alert: true,
			message
		}, function() {
			this.forceUpdate();
		}.bind(this));
	}

	render() {
		return (
			<Layout 
				campgains={this.state.campgains} 
				templates={this.state.templates}
				message={this.state.message}
				showAlert={this.state.alert}
				selectedCampgainId={this.state.selectedCampgainId} 
				source={this.props.source} 
				createCampgain={this.createCampgain.bind(this)} 
				setSelectedId={this.setSelectedCampgainId.bind(this)}
				setAlert={this.setAlert.bind(this)}
				getTemplates={this.loadTemplates.bind(this)}>
			</Layout>
		)
	}
}

class Layout extends React.Component {
  render() {
    return (
    	<div class="container content">
				<div class="row">
	    		<Navbar get={this.props.campgains} setSelectedId={this.props.setSelectedId} />
	    		<Alert show={this.props.showAlert}>{this.props.message}</Alert>
	    		<ListContainer source={this.props.source} selectedCampgainId={this.props.selectedCampgainId} setAlert={this.props.setAlert} templates={this.props.templates}/>
	    		<Panel createCampgain={this.props.createCampgain} setAlert={this.props.setAlert} templates={this.props.templates} getTemplates={this.props.getTemplates}/>
				</div>
			</div>	
    )	
  }
}

