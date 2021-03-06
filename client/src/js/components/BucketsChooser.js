import AlertContainer from 'react-alert';

import React from 'react';

import auth from '../auth';

export default class BucketsChooser extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buckets: []
		};

		this.alertOptions = {
      offset: 0,
      position: 'top left',
      theme: 'light',
      time: 10000,
      transition: 'scale'
    };
	}

	loadBuckets() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/buckets`,
			crossDomain: true,

			beforeSend: function (request) {
      	request.setRequestHeader("Authorization", auth.getToken());
      },

			success: function(data) {
				if (!this.UnMount) {
					this.setState({
						buckets: data
					});
				}
			}.bind(this),

			error: function() {
				console.log('Some trouble with token!');

        this.setAlert({
          message: 'Something bad with connection....try again or relogin',
          type: 'info'
        });
			}.bind(this),
    });
  }

  setAlert({message, type}) {
    msg.show(message, {
      type
    });
  }

	componentWillMount() {
		this.UnMount = false;
		this.loadBuckets();
	}	

	componentWillUnmount() {
		this.UnMount = true;
	}

	componentDidUpdate() {
	  let selectNode = this.refs.selectingComponent;
	  
	  if (selectNode !== undefined) {
	  	selectNode.value = this.props.defaultValue;
	  }
	}

	render() {
    if (this.state.buckets.length === 0) {
    	return <select class="form-control" disabled></select>
    }

   	var options = this.state.buckets.filter(function(value) {
     	return ~value.Name.indexOf('www');
    }).map(function(value) {
    	let nameWithoutWWW = value.Name.split('www.').splice(1).join('');
    	
    	return (
				<option value={value.Name} key={value.CreationDate}>{nameWithoutWWW}</option>
      );
    });

		return (
			<div>
				<select id={this.props.id} ref="selectingComponent" class="form-control">
					<option disabled value="def">Domain</option>
				  {options}
				</select>
				<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
			</div>
		)
	}
}

BucketsChooser.defaultProps = {
	defaultValue: 'def'
};