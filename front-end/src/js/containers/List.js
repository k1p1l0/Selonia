import React from 'react';

import TemplatesChooserContainer from '../components/TemplatesChooserContainer';

export default class ListContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recipients: [],	
		};
	}

	loadRecipients(newId) {
		var URL = (newId > 0) ? `${this.props.source}/campgains/${newId}`: `${this.props.source}/campgains/${this.props.selectedCampgainId}`

    $.ajax({
      type: 'GET', 
			url: URL,

			success: function(data) {
				if (data.Items) {
					if (data.Items.length === 0) {
						this.setState({recipients: []}, function() {
							this.forceUpdate();
						}.bind(this));
					} else {
						this.setState({recipients: data.Items});
					}

					$('.loader').hide();
					$('#main-table').show();
				}
			}.bind(this),

			error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
    });
  }

  createRecipientFromClient({name, email, templateId, templateName}) {
  	 $.ajax({
     	type: 'POST',
			url: `${this.props.source}/campgains/${this.props.selectedCampgainId}`,
			data: JSON.stringify({
				"recipients": [{
					campgainId: parseInt(this.props.selectedCampgainId),
					name,
					email,
					templateId,
					templateName
				}]
			}),

			contentType: "application/json",

			success: function(data) {
				if (!data.errorMessage) {
					this.props.setAlert({message: 'Successfully added new recipient', type: 'success'});
				} else {
					this.props.setAlert({message: data.errorMessage, type: 'error'});
				}
				this.loadRecipients();
			}.bind(this)
    });
  }

  componentWillMount() {
  	this.loadRecipients();
  }

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.selectedCampgainId !== nextProps.selectedCampgainId) {
			this.loadRecipients(nextProps.selectedCampgainId);
    	return true;
		} else if (nextState.recipients.length > 0) {
			return true;
		}

		return false;
  }

	setRecipients(newOne) {
		this.setState({recipients: this.state.recipients.concat(newOne)});
	}

	render() {
		return <List get={this.state.recipients} set={this.setRecipients.bind(this)} source={this.props.source} createNew={this.createRecipientFromClient.bind(this)} />
	}
}

class List extends React.Component {
	onClick() {
		let data = {
			id: Date.now(),
			name: $('#nameInput').val(),
			email: $('#emailInput').val(),
			templateId: parseInt($('select[name="newRecipientTemplate"] option:selected').val()),
			templateName: $('select[name="newRecipientTemplate"] option:selected').text()
		};

		this.props.set(data);
		this.props.createNew(data);
		this.clear();
	}

	clear() {
		$('#nameInput').val('');	
		$('#emailInput').val('');	
		$('select[name="newRecipientTemplate"]').val('def');
	}

	render() {
		let campgainName = localStorage.getItem('selectCampgainName') || 'Please choose or create campaign.';

		function sortById (a, b) {
			return a.id - b.id;
		}

 		let recipients = this.props.get.sort(sortById).map(function(recipient, i) {
      return (
				<RecipientTable data={recipient} key={recipient.id} i={i}/>
      );
    }.bind(this));

		return (
			<div class="col-lg-8">
				<div class="panel panel-default">
				  <div class="panel-heading">
				  	<div class="row">
				  		<div class="col-lg-2">
						  	<div class="btn-group">
									  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={~campgainName.indexOf('Please')}>
									    {campgainName} <span class="caret"></span>
									  </button>
									  <ul class="dropdown-menu">
									    <li><a href="#">Delete list</a></li>
									    <li><a href="#">Delete campgain</a></li>
									    <li role="separator" class="divider"></li>
									    <li><a href="#">Send to all</a></li>
									  </ul>
								</div>
							</div>
				  	</div>
				  </div>

					<div class="loader">
					</div>

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
							<td>
								<TemplatesChooserContainer source={this.props.source} selectName="newRecipientTemplate" />
							</td>
							<td>
								<button type="button" class="btn btn-success" onClick={this.onClick.bind(this)} style={{width: '95%'}}>Add</button>
							</td>
						</tr>
						</tfoot>
					</table>
				</div>
			</div>
		)
	}
}

class RecipientTable extends React.Component {
	render() {
		return (
			<tr class="animation-bottom">
				<td>{this.props.i + 1}</td>
				<td>{this.props.data.name}</td>
				<td>{this.props.data.email}</td>
				<td>
						{this.props.data.templateName}
				</td>
				<td>
					<button type="button" class="btn btn-success" disabled>Send</button>
					<button type="button" class="btn btn-danger" disabled>Delete</button>
				</td>
			</tr>
		)
	}
}