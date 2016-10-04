import React from 'react';

import UploadRecipientsContainer from './UploadRecipientsContainer';
import UploadTemplatesContainer from './UploadTemplatesContainer';

export default class Panel extends React.Component {
	createCampgain() {
		let data = {
			name: $('#inputCampgain').val()
		};

		$('#inputCampgain').val('');

		this.props.createCampgain(data);
	}

	render() {
		return (
			<div class="col-lg-4">

				<div class="panel panel-default">
	  			<div class="panel-heading">Campaigns actions</div>
	  				<div class="panel-body">
	  					<div class="row">

							    <div class="col-lg-8">
							      <input type="email" class="form-control" id="inputCampgain" placeholder="Input campgain name"/>
							    </div>

							    <div class="col-lg-4">
							      <button type="submit" onClick={this.createCampgain.bind(this)} class="btn btn-primary btn-block">Create</button>
							    </div>
	  					</div>
	  				</div>
					</div>

					<UploadRecipientsContainer  setAlert={this.props.setAlert} source={this.props.source} />
					<UploadTemplatesContainer setAlert={this.props.setAlert} />
			</div>
		)
	}
}
