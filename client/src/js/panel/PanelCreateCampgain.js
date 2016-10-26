import React from 'react';

import BucketsChooser from '../components/BucketsChooser';

export default class PanelCampgain extends React.Component {
	createCampgain({target}) {
		let data = {
			name: $('#inputCampgain').val(),
			domain: $('#inputDomain option:selected').val(),
			target
		}

		$('#inputCampgain').val('');

		this.props.createCampgain(data);
	}
	
	render() {
		return (
			<div class="col-lg-6">
				<div class="panel panel-default">
					<div class="panel-heading">Create campaign</div>
					<div class="panel-body">
						<div class="row">

						    <div class="col-lg-4">
						      <input type="email" class="form-control" id="inputCampgain" placeholder="Name"/>
						    </div>

						    <div class="col-lg-4">
						   		<BucketsChooser id="inputDomain" source={this.props.source} />
						    </div>

						    <div class="col-lg-4">
						      <button type="submit" onClick={this.createCampgain.bind(this)} style={{'width':'90%'}} class="btn btn-primary btn-block">Create</button>
						    </div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}