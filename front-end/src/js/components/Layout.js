import React from "react";

import Panel from './Panel';
import TemplatesChooser from './TemplatesChooser';

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
	constructor() {
		super();

		this.state = {
			localRecipients: []
		};
	}

	onClick() {
		let data = {
			name: $('#nameInput').val(),
			email: $('#emailInput').val()
		}

		this.props.recipients().push(data);
		this.forceUpdate();
		this.props.createNew(data);
	}

	render() {
		function sortById (a, b) {
			return a.id > b.id;
		}

		this.state.localRecipients = this.props.recipients().sort(sortById);

		let recipients = this.state.localRecipients.map((recipient) => {
			return <RecipientTable data={recipient} key={recipient.id} />;
    });

		return (
			<div class="col-lg-8">
				<div class="loader"></div>
				<table class="table table-hover animate-bottom" id="main-table">
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
		)
	}
}

export default class Layout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			recipients: []
		};
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
    this.loadRecipientFromServer();
    // setInterval(this.loadRecipientFromServer.bind(this), 10000);
  }

	getRecipients() {
		return this.state.recipients;
	}

  render() {
    return (
    	<Container>
    		<Navbar />
    		<List recipients={this.getRecipients.bind(this)} createNew={this.createRecipientFromClient.bind(this)} />
    		<Panel />
    	</Container>
    )
  }
}

class Navbar extends React.Component {
	render() {
		return (
			<nav class="navbar navbar-default">
			  <div class="container">
			    <div class="row">
	      		<div class="col-lg-10">
	        		<p><a class="navbar-brand" href="#">Compaign name</a></p>
	        	</div>
	        	<div class="col-lg-2">
	        		<p style={{marginTop: '10px'}}>	
        				<select name="templates" class="form-control" defaultValue="def">
							    <option disabled value="def">Choose template</option>
							    <option value="origin">Origin</option>
							    <option value="new">New</option>
								</select>
							</p>
	        	</div>
	        </div>
	       </div>
			</nav>
		)
	}
}