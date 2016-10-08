import React from 'react';

import PanelDomain from './PanelDomain';

export default class PanelCampgain extends React.Component {
	createCampgain({target}) {
		let data = {
			name: $('#inputCampgain').val(),
			domain: $('#inputDomain option:selected').text(),
			target
		}

		$('#inputCampgain').val('');

		this.props.createCampgain(data);
	}
	
	render() {
		return (
			<div class="panel panel-default">
				<div class="panel-heading">Create campaign</div>
				<div class="panel-body">
					<div class="row">

					    <div class="col-lg-4">
					      <input type="email" class="form-control" id="inputCampgain" style={{width: '110px'}} placeholder="Name"/>
					    </div>

					    <div class="col-lg-4">
					   		<PanelDomain name="inputDomain" source={this.props.source} />
					    </div>

					    <div class="col-lg-4">
					      <button type="submit" onClick={this.createCampgain.bind(this)} class="btn btn-primary btn-block">Create</button>
					    </div>
					</div>
				</div>
			</div>
		)
	}
}