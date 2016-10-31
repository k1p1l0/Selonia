import React from 'react';

import CampaignsChooser from '../components/CampaignsChooser';

import ListBtnSendModal from './ListBtnSendModal';
import ListBtnEditCampaignModal from './ListBtnEditCampaignModal';

export default class ListHeader extends React.Component {

	render() {
		let campgainName = localStorage.getItem('selectCampgainName') ? `${localStorage.getItem('selectCampgainName')} (${this.props.getDomain})`: 'Please choose or create campaign';

		var buttonProps = {
		  defaultValue: 'def',
		  className: 'btn btn-info',
		  type: 'button',
		  style: {marginLeft: '5px'}
		};

		if (~campgainName.indexOf('Please')) {
			buttonProps.disabled = true;
			buttonProps.style = {display: 'none'};
		}
		
		return (
			<div class="panel-heading">
				<CampaignsChooser values={this.props.getCampgains} name="campaign" text="campaign" loadRecipientsDirect={this.props.loadRecipientsDirect} setSelectedCampgainId={this.props.setSelectedCampgainId}/>

				<h2>
					<small style={{float: 'right', display: 'block'}}>{~campgainName.indexOf('Please') ? '': 'Count: ' + this.props.totalAmoutRecipients}</small>
					{campgainName} 
				</h2>	
		  	
		  	<ListBtnSendModal 
		  		buttonProps={buttonProps} 
		  		toggleLoadIcon={this.props.toggleLoadIcon} 
		  		templates={this.props.templates} 
		  		getDomain={this.props.getDomain} 
		  		getCampgainId={this.props.getCampgainId} 
		  		getRecipients={this.props.getRecipients} 
		  		setAlert={this.props.setAlert} 
		  		source={this.props.source}>Send emails</ListBtnSendModal>

			  <ListBtnEditCampaignModal 
			  	getCampgainId={this.props.getCampgainId} 
			  	getDomain={this.props.getDomain} 
			  	buttonProps={buttonProps} 
		  		setAlert={this.props.setAlert} 
		  		toggleLoadIcon={this.props.toggleLoadIcon} 
		  		campaignWasEdited={this.props.campaignWasEdited}
			  	source={this.props.source}>Edit campaign</ListBtnEditCampaignModal>

			  <button {...buttonProps} class='pull-right btn btn-danger' onClick={this.props.deleteList}>Delete list</button>
			  <button {...buttonProps} class='pull-right btn btn-danger' onClick={this.props.deleteCampgain}>Delete campaign</button>
			</div>
		)
	}
}