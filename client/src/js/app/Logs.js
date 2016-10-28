import React from 'react';
import AlertContainer from 'react-alert';
import cls from 'classnames';
import moment from 'moment';

import auth from '../auth';

export default class extends React.Component {
	constructor() {
		super();

		this.state = {
			logs: [],
			timeUpdate: moment().format('LTS')
		};

		this.alertOptions = {
      offset: 0,
      position: 'top left',
      theme: 'light',
      time: 10000,
      transition: 'scale'
    };
	}

	loadLogs(callback) {
		$.ajax({
			type: 'GET',
			url: `${this.props.source}/logs`,
			crossDomain: true,

			beforeSend: function (request) {
			  request.setRequestHeader("Authorization", auth.getToken());
			},

			success: function(data) {
				if (!this.UnMount) {
					console.log(data);
					
					this.setState({logs: data}, callback ? callback: null);
					this.setState({timeUpdate: moment().format('LTS')});
					$('#refreshIcon').toggleClass('gly-spin');
				}
			}.bind(this),

			error: function() {
				console.log('Some trouble with token!');

				auth.logout();
				location.reload();
			}
		})
	}

	setAlert({message, type}) {
    msg.show(message, {
      type
    });
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

		this.loadLogs(function() {
			this.setAlert({
				message: 'Logs are successfully updated',
				type: 'success'
			});
		}.bind(this));
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

	createRow(log, i, local) {
		let clsResponse = cls({
			'danger': log.response !== '200',
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

	render() {
		function sortByTime (a, b) {
			let momentA = moment(a.time, 'YYYY-MM-DD h:mm:ss a').valueOf();
			let momentB = moment(b.time, 'YYYY-MM-DD h:mm:ss a').valueOf();

			return momentB - momentA;
		}

		let logsCurrentCampgain = this.state.logs.filter(function(log) {
			return localStorage.getItem('selectCampgainId') == log.campaign;
		}.bind(this)).sort(sortByTime).map(function(log, i) {
    	return this.createRow(log, i, 1)
    }.bind(this));

    let logsOtherCampgain = this.state.logs.filter(function(log) {
			return localStorage.getItem('selectCampgainId') !== log.campaign;
		}.bind(this)).sort(sortByTime).map(function(log, i) {
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

  			<p style={{fontSize: '23px'}}>Last updated: {this.state.timeUpdate}</p>
			  <table class="table table-bordered">
			  <thead>
			  	<tr class="active">
			  		<th>Mailto</th>
			  		<th>From</th>
			  		<th>Subject</th>
			  		<th>Campgain</th>
			  		<th style={{minWidth: '120px'}}>Time</th>
			  		<th>Response</th>
			  	</tr>
			  </thead>
			  <tbody>
			  	{logsCurrentCampgain}
			  </tbody>
			  <tfoot class="active">
			  {
			  	this.load ? logsOtherCampgain: ''
			  }
			  </tfoot>
			  </table>
			  <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
			</div>
		)
	}
}