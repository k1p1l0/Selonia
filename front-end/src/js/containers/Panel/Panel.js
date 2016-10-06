import React from 'react';

import UploadRecipientsContainer from './UploadRecipientsContainer';
import UploadTemplatesContainer from './UploadTemplatesContainer';
import CreateCampgain from './CreateCampgain';

export default class Panel extends React.Component {
	render() {
		return (
			<div class="col-lg-4">
				<CreateCampgain createCampgain={this.props.createCampgain} source={this.props.source} />
				<UploadRecipientsContainer setAlert={this.props.setAlert} templates={this.props.templates} startIntervalRecipientsLoad={this.props.startIntervalRecipientsLoad} source={this.props.source} />
				<UploadTemplatesContainer startIntervalTemplateLoad={this.props.startIntervalTemplateLoad} setAlert={this.props.setAlert} />
			</div>
		)
	}
}