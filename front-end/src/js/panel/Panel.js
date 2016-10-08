import React from 'react';

import PanelTemplates from './PanelTemplates';
import PanelRecipients from './PanelRecipients';
import PanelCampgain from './PanelCampgain';

export default class Panel extends React.Component {
	render() {
		return (
			<div class="col-lg-4">
				<PanelCampgain createCampgain={this.props.createCampgain} source={this.props.source} />
				<PanelRecipients toggleLoadIcon={this.props.toggleLoadIcon} setAlert={this.props.setAlert} templates={this.props.templates} startIntervalRecipientsLoad={this.props.startIntervalRecipientsLoad} source={this.props.source} />
				<PanelTemplates toggleLoadIcon={this.props.toggleLoadIcon} startIntervalTemplateLoad={this.props.startIntervalTemplateLoad} setAlert={this.props.setAlert} />
			</div>
		)
	}
}