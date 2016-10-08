import React from 'react';

import cls from 'classnames';

export default class extends React.Component {
	constructor() {
		super();

		this.state = {
			logs: []
		};
	}

	loadLogs() {
		console.log(`${this.props.source}/logs`);

		$.ajax({
			type: 'GET',
			url: `${this.props.source}/logs`,

			success: function(data) {
				if (!this.UnMount) {
					this.setState({logs: data});
					$('#refreshIcon').toggleClass('gly-spin');
				}
			}.bind(this)
		})
	}

	componentWillMount() {
		this.UnMount = false;
		this.load = false;
		this.loadLogs();
	}	

	componentWillUnmount() {
		this.UnMount = true;
	}

	refreshLogs() {
		$('#refreshIcon').toggleClass('gly-spin');

		this.loadLogs();
	}

	createRow(log, i, local) {
		let clsResponse = cls({
			'warning': log.response !== '200',
			'success': log.response == 200
		});

		return (
			<tr class={clsResponse} key={i}>
			  	<td>{log.mailto}</td>
			  	<td>{log.from}</td>
			  	<td>{log.subject}</td>
			  	<td>{local ? localStorage.getItem('selectCampgainName'): log.campaign}</td>
			  	<td>{log.time}</td>
			  	<td>{log.response}</td>
		  </tr>
     );
	}

	loadAll() {
	  let $icon = $('#loadIcon');
	  let $text = $icon.next().text();
	  let $button = $icon.closest('.btn');

		$('#loadIcon').next().text(
        $text === ' Show all campaigns' ? ' Hide other campaigns' : ' Show all campaigns');

		$button.toggleClass('active');
	  $icon.toggleClass('glyphicon-eye-open');
	  $icon.toggleClass('glyphicon-eye-close');

		this.load = !this.load;

		this.forceUpdate();
	}

	render() {
		let logsCurrentCampgain = this.state.logs.filter(function(log) {
			return localStorage.getItem('selectCampgainId') == log.campaign;
		}.bind(this)).map(function(log, i) {
    	return this.createRow(log, i, 1)
    }.bind(this));

    let logsOtherCampgain = this.state.logs.filter(function(log) {
			return localStorage.getItem('selectCampgainId') !== log.campaign;
		}.bind(this)).map(function(log, i) {
    	return this.createRow(log, i, 0)
    }.bind(this));

		return (
			<div class="table-responsive">
			  <button type="button" onClick={this.refreshLogs.bind(this)} class="btn btn-default" style={{marginBottom: '10px', marginLeft: '0px', marginRight: '10px'}}>
			  	<i id="refreshIcon" class="glyphicon glyphicon-refresh gly-spin"></i> <span>Refresh</span>
  			</button>

  			<button type="button" onClick={this.loadAll.bind(this)} class="btn btn-default" style={{marginBottom: '10px', marginLeft: '0px'}}>
			  	<i id="loadIcon" class="glyphicon glyphicon-eye-open"></i><span> Show all campaigns</span>
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
			  	{logsCurrentCampgain}
			  </tbody>
			  <tfoot>
			  {
			  	this.load ? logsOtherCampgain: ''
			  }
			  </tfoot>
			  </table>
			</div>
		)
	}
}