import React from 'react';
import AlertContainer from 'react-alert';

import Panel from '../panel/Panel';
import PanelTemplates from '../panel/PanelTemplates';
import PanelCreateCampgain from '../panel/PanelCreateCampgain';

import auth from '../auth';

export default class LayoutGlobal extends React.Component {
	constructor(props) {
		super(props);

		this.alertOptions = {
      offset: 0,
      position: 'top left',
      theme: 'light',
      time: 10000,
      transition: 'scale'
    };
	}

	createCampgain({name, domain, target}) {
  	if (!name.length) {
  		this.setAlert({ 
  			message: 'Please enter campaign name',
  			type: 'info'
  		});

  		return;
  	}

  	 if (~domain.indexOf('Domain')) {
  		this.setAlert({ 
  			message: 'Please choose domain name',
  			type: 'info'
  		});

  		return;
  	}

  	this.toggleLoadIcon(target, 'Create');

    $.ajax({
      type: 'POST',
			url: `${this.props.source}/campgains`,
			data: JSON.stringify({
				name,
				domain
			}),
			contentType: "application/json",
			crossDomain: true,

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {				
				this.setAlert({
	  			message: 'Campaign is successfully added  - ' + data.name,
	  			type: 'success'
  			});

  			this.toggleLoadIcon(target, 'Create');

			}.bind(this),

			error: function() {
        this.setAlert({
          message: 'Something bad with connection....try again or relogin',
          type: 'info'
        });
			}.bind(this)
    });
  }

  setAlert({message, type}) {
    msg.show(message, {
      type
    });
  }

  toggleLoadIcon(target, text) {
  	let width = $(target).width();

  	if ($(target).children()[0] === undefined) {
  		$(target).prop('disabled', true);
  		$(target).html(`<div style="width: ${width}px" class="glyphicon glyphicon-repeat gly-spin"></div>`);
  	} else {
  		$(target).prop('disabled', false);
	  	$(target).html(text);
  	}
  }

 	componentWillMount() {
		this.UnMount = false;
	}

	render() {
		return (
		 	<Panel>
		 			<div class="col-lg-12">
						<PanelCreateCampgain createCampgain={this.createCampgain.bind(this)} source={this.props.source} />
						<PanelTemplates toggleLoadIcon={this.toggleLoadIcon.bind(this)} setAlert={this.setAlert.bind(this)} />
						<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
					</div>
  		</Panel>
		)
	}
};