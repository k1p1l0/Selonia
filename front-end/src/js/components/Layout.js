import React from "react";

import Panel from './Panel';
import TemplatesChooser from './TemplatesChooser';
import Chooser from './Chooser';

class Container extends React.Component {
	render() {
		return (
			<div class="container content">
				<div class="row">
					{this.props.children}
				</div>
			</div>	
		);
	}
}

class RecipientTable extends React.Component {
	render() {
		return (
			<tr class="animation-bottom">
				<td>{this.props.data.id}</td>
				<td>{this.props.data.name}</td>
				<td>{this.props.data.email}</td>
				<td>
					<TemplatesChooser />
				</td>
				<td>
					<button type="button" class="btn btn-success" disabled>Send</button>
					<button type="button" class="btn btn-danger" disabled>Delete</button>
				</td>
			</tr>
		)
	}
}

class List extends React.Component {
	onClick() {
		let data = {
			name: $('#nameInput').val(),
			email: $('#emailInput').val(),
			id: this.props.get().length + 1
		}

		this.props.createNew(data);
	}

	render() {
		function sortById (a, b) {
			return a.id - b.id;
		}

 		var recipients = this.props.get().sort(sortById).map(function(recipient) {
      return (
				<RecipientTable data={recipient} key={recipient.id} />
      );
    }.bind(this));

		return (
			<div class="col-lg-8">
				<div class="panel panel-default">
				  <div class="panel-heading">CSV List</div>
					<div class="loader"></div>
					<table class="table animate-bottom" id="main-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Email</th>
								<th>Template</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{recipients}
						</tbody>
						<tfoot>
						<tr class="success">
							<td colSpan="2">
								<input type="text" class="form-control" id="nameInput" placeholder="Name input"/>
							</td>
							<td>
								<input type="text" class="form-control" id="emailInput" placeholder="Email input"/>
							</td>
							<td colSpan="2">
								<button type="button" class="btn btn-success" onClick={this.onClick.bind(this)} style={{width: '100%'}}>Add</button>
							</td>
						</tr>
						</tfoot>
					</table>
				</div>
			</div>
		)
	}
}

export default class Layout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			recipients: [],
			campgains: [],
			campgainSelected: localStorage.getItem('selectCampgain')
		};
	}

	loadCompgain() {
    $.ajax({
      type: 'GET',
			url: "https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod/campgains",

			success: function(data) {
				this.setState({campgains: data.Items});
			}.bind(this)
    });
  }

  createCampgain({name}) {
    $.ajax({
      type: 'POST',
			url: "https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod/campgains",
			data: JSON.stringify({
				"campgain": {
					name
				}
			}),
			contentType: "application/json",

			success: function(data) {
				console.log(data);
				// this.setState({campgains: data.Items});
			}.bind(this)
    });
  }

	loadRecipientFromServer() {
    $.ajax({
      type: 'GET',
			url: this.props.source,

			success: function(data) {
				this.setState({recipients: data.Items});

				$('.loader').hide();
				$('#main-table').show();

			}.bind(this)
    });
  }

  createRecipientFromClient({name, email}) {
  	 $.ajax({
     	type: 'POST',
			url: this.props.source,
			data: JSON.stringify({
				"recipients": [{
					name,
					email
				}]
			}),

			contentType: "application/json",

			success: function() {
				this.loadRecipientFromServer();
			}.bind(this)
    });
  }

	componentDidMount() {
    // this.loadRecipientFromServer();
    setInterval(this.loadRecipientFromServer.bind(this), 1000);
  }

	getRecipients() {
		return this.state.recipients;
	}

	setRecipients(newOne) {
		this.setState({recipients: this.state.recipients.concat(newOne)});
	}

  render() {
    return (
    	<Container>
    		<Navbar load={this.loadCompgain.bind(this)} get={this.state.campgains} />
    		<List get={this.getRecipients.bind(this)} set={this.setRecipients.bind(this)} createNew={this.createRecipientFromClient.bind(this)} />
    		<Panel createCampgain={this.createCampgain.bind(this)} />
    	</Container>
    )	
  }
}

class Navbar extends React.Component {
	componentDidMount() {
    this.props.load();
  }

	render() {
		return (
			<nav class="navbar navbar-default">
			  <div class="container">
			    <div class="row">
	      		<div class="col-lg-10">
	        		<p><a class="navbar-brand" href="#">Campaign name</a></p>
	        	</div>
	        	<div class="col-lg-2">
	        		<p style={{marginTop: '10px'}}>	
	        			<Chooser values={this.props.get} name="campgains" text="campgain"/>
							</p>
	        	</div>
	        </div>
	       </div>
			</nav>
		)
	}
}