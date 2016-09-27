import React from "react";

import Navbar from './Navbar';
import Panel from './Panel';
import ListContainer from './List';

export default class LayoutContainer extends React.Component {
	constructor() {
		super();

		this.state = {
			campgains: [],
			selectedCampgainId: localStorage.getItem('selectCampgain')
		};
	}

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: this.props.source,

			success: function(data) {
				console.log(data);
				this.setState({campgains: data.Items});
			}.bind(this)
    });
  }

  createCampgain({name}) {
    $.ajax({
      type: 'POST',
			url: this.props.source,
			data: JSON.stringify({
				"campgain": {
					name
				}
			}),
			contentType: "application/json",

			success: function(data) {
				console.log(data);
			}.bind(this)
    });
  }

	componentWillMount() {
		this.loadCompgain();
	}

	setSelectedId(id) {
		this.setState({selectedCampgainId: id}, () => {
			console.log('Only now :(');
		});
	}

	render() {
		return <Layout campgains={this.state.campgains} 
									 createCampgain={this.createCampgain.bind(this)} 
									 source={this.props.source} 
									 selectedCampgainId={this.state.selectedCampgainId} 
									 setSelectedId={this.setSelectedId.bind(this)} 
					  />
	}
}

class Layout extends React.Component {
  render() {
    return (
    	<div class="container content">
				<div class="row">
	    		<Navbar get={this.props.campgains} setSelectedId={this.props.setSelectedId}  />
	    		<ListContainer source={this.props.source} selectedCampgainId={this.props.selectedCampgainId} />
	    		<Panel createCampgain={this.props.createCampgain} />
				</div>
			</div>	
    )	
  }
}