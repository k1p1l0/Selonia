import React from 'react';

import CampaignsChooser from './CampaignsChooser';

export default class Navbar extends React.Component {
	render() {
		return (
			<nav class="navbar navbar-default">
			  <div class="container">
			    <div class="row">
	      		<div class="col-lg-10">
	        		<p><a class="navbar-brand" href="#">Selonia</a> </p>
	        	</div>
	        	<div class="col-lg-2">
	        		<p style={{marginTop: '10px'}}>	
	        			<CampaignsChooser values={this.props.get} name="campaign" text="campaign" setSelectedId={this.props.setSelectedId}/>
							</p>
	        	</div>
	        </div>
	       </div>
			</nav>
		)
	}
}