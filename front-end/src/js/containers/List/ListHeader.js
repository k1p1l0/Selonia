import React from 'react';

import CampaignsChooser from '../../components/CampaignsChooser';

export default class ListHeader extends React.Component {
	render() {
		let campgainName = localStorage.getItem('selectCampgainName') || 'Please choose or create campaign';

		var buttonProps = {
		  defaultValue: 'def',
		  className: 'btn btn-default',
		  type: 'button'
		};

		if (~campgainName.indexOf('Please')) {
			buttonProps.disabled = true;
			buttonProps.style = {display: 'none'};
		}
		
		return (
			<div class="panel-heading">
						<CampaignsChooser values={this.props.getCampgains} name="campaign" text="campaign" setSelectedCampgainId={this.props.setSelectedCampgainId}/>
						<h2> {campgainName} <small>{~campgainName.indexOf('Please') ? '': 'Chosen campaign'}</small></h2>	
				  	<div class="btn-group">
							  <button {...buttonProps} disabled>
							    Send to all
							  </button>
						</div>
					  <button {...buttonProps} onClick={this.props.deleteList}>Delete list</button>
					  <button {...buttonProps} onClick={this.props.deleteCampgain}>Delete campaign</button>
			  </div>
		)
	}
}