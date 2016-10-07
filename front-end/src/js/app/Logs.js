import React from 'react';

export default class extends React.Component {
	refreshLogs() {
		$('#refreshIcon').toggleClass('gly-spin');
	}

	render() {
		return (
			<div class="table-responsive">
			  <button type="button" onClick={this.refreshLogs.bind(this)} class="btn btn-default" style={{marginBottom: '10px', marginLeft: '0px', display: 'block'}}>
			  	<i id="refreshIcon" class="glyphicon glyphicon-refresh"></i> Refresh
  			</button>
			  <table class="table table-bordered">
			  <thead>
			  	<tr class="active">
			  		<th>Mailto</th>
			  		<th>From</th>
			  		<th>Subject</th>
			  		<th>Campgain</th>
			  		<th>Time</th>
			  		<th>Response</th>
			  	</tr>
			  </thead>
			  <tbody>
			  	<tr>
				  	<td>asd@mail.ru</td>
				  	<td>s0ht@mail.ru</td>
				  	<td>I Like your house!</td>
				  	<td>WC2017</td>
				  	<td>13:14:21 12/04/04 (UTC+2)</td>
				  	<td>200</td>
			  	</tr>
			  </tbody>
			  </table>
			</div>
		)
	}
}