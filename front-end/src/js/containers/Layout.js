import React from "react";
import AlertContainer from 'react-alert';

import Navbar from './Navbar';
import Panel from './Panel';
import ListContainer from './List';

export default class LayoutContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			campgains: [],
			selectedCampgainId: localStorage.getItem('selectCampgainId'),
			selectedCampgainName: localStorage.getItem('selectedCampgainName'),
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
	  			message: 'Successfully added new campaign - ' + data.name,
	  			type: 'success'
  			});

			}.bind(this)
    });
  }

	componentWillMount() {
		this.loadCompgain();
	}

	setSelectedCampgainId(id) {
		this.setState({selectedCampgainId: id});
	}

	setAlert({message, type}){
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
				selectedCampgainId={this.state.selectedCampgainId} 
				source={this.props.source} 
				createCampgain={this.createCampgain.bind(this)} 
				setSelectedId={this.setSelectedCampgainId.bind(this)}
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
	    		<Navbar get={this.props.campgains} setSelectedId={this.props.setSelectedId} />
	    		<ListContainer source={this.props.source} selectedCampgainId={this.props.selectedCampgainId} setAlert={this.props.setAlert} getTemplates={this.props.getTemplates} templates={this.props.templates}/>
	    		<Panel createCampgain={this.props.createCampgain} source={this.props.source} setAlert={this.props.setAlert} templates={this.props.templates} getTemplates={this.props.getTemplates}/>
				</div>
				{this.props.children}
			</div>	
    )	
  }
}

