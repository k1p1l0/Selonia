import React from "react";

import Alert from './Alert';
import Navbar from './Navbar';
import Panel from './Panel';
import ListContainer from './List';

export default class LayoutContainer extends React.Component {
	constructor() {
		super();

		this.state = {
			campgains: [],
			selectedCampgainId: localStorage.getItem('selectCampgainId'),
			selectedCampgainName: localStorage.getItem('selectedCampgainName'),
			message: '',
			alert: false
		};
	}

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: this.props.source,

			success: function(data) {
				this.setState({
					campgains: data.Items
				});
			}.bind(this)
    });
  }

  createCampgain({name}) {
  	console.log(name)
    $.ajax({
      type: 'POST',
			url: this.props.source,
			data: JSON.stringify({
				name
			}),
			contentType: "application/json",

			success: function(data) {
				this.setState({
					campgains: this.state.campgains.concat(data),
					alert: true,
					message: 'Successfully added new campgain - ' + data.name
				});
			}.bind(this)
    });
  }

	componentWillMount() {
		this.loadCompgain();
	}

	setSelectedId(id) {
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
				createCampgain={this.createCampgain.bind(this)} 
				source={this.props.source} 
				selectedCampgainId={this.state.selectedCampgainId} 
				setSelectedId={this.setSelectedId.bind(this)}
				setAlert={this.setAlert.bind(this)}
				message={this.state.message}
				showAlert={this.state.alert}>
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
	    		<ListContainer source={this.props.source} selectedCampgainId={this.props.selectedCampgainId} setAlert={this.props.setAlert} />
	    		<Panel createCampgain={this.props.createCampgain} />
				</div>
			</div>	
    )	
  }
}

