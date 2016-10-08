import React from 'react';

import CampaignsChooser from '../components/CampaignsChooser';

import ListBtnModal from './ListBtnModal';

export default class ListHeader extends React.Component {

	render() {
		let campgainName = localStorage.getItem('selectCampgainName') ? `${localStorage.getItem('selectCampgainName')} (${this.props.getDomain})`: 'Please choose or create campaign';

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
				<CampaignsChooser values={this.props.getCampgains} name="campaign" text="campaign" loadRecipients={this.props.loadRecipients} setSelectedCampgainId={this.props.setSelectedCampgainId}/>

				<h2> {campgainName} <small>{~campgainName.indexOf('Please') ? '': 'Chosen campaign'}</small></h2>	
		  	
		  	<ListBtnModal buttonProps={buttonProps} templates={this.props.templates} getDomain={this.props.getDomain} getCampgainId={this.props.getCampgainId} getRecipients={this.props.getRecipients} setAlert={this.props.setAlert} source={this.props.source}/>
			  <button {...buttonProps} onClick={this.props.deleteList}>Delete list</button>
			  <button {...buttonProps} onClick={this.props.deleteCampgain}>Delete campaign</button>
			  <button {...buttonProps} disabled>Edit campaign</button>
			</div>
		)
	}
}