import React from 'react';

import CampgainsChooser from './CampgainsChooser';

export default class Navbar extends React.Component {
	render() {
		let campgainName = localStorage.getItem('selectCampgainName');

		return (
			<nav class="navbar navbar-default">
			  <div class="container">
			    <div class="row">
	      		<div class="col-lg-10">
	        		<p><a class="navbar-brand" href="#">Selonia <span class="label label-success">{campgainName}</span></a></p>
	        	</div>
	        	<div class="col-lg-2">
	        		<p style={{marginTop: '10px'}}>	
	        			<CampgainsChooser values={this.props.get} name="campgains" text="campgain" setSelectedId={this.props.setSelectedId}/>
							</p>
	        	</div>
	        </div>
	       </div>
			</nav>
		)
	}
}