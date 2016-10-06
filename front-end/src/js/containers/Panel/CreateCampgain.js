import React from 'react';

import AddDomainContainer from './AddDomainContainer';

export default class CreateCampgain extends React.Component {
	createCampgain() {
		let data = {
			name: $('#inputCampgain').val(),
			domain: $('#inputDomain option:selected').text()
		}

		$('#inputCampgain').val('');

		this.props.createCampgain(data);
	}
	
	render() {
		return (
			<div class="panel panel-default">
				<div class="panel-heading">Create campgain</div>
				<div class="panel-body">
					<div class="row">

					    <div class="col-lg-4">
					      <input type="email" class="form-control" id="inputCampgain" style={{width: '110px'}} placeholder="Name"/>
					    </div>

					    <div class="col-lg-4">
					   		<AddDomainContainer name="inputDomain" source={this.props.source} />
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