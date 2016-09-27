import React from 'react';

import TemplatesChooser from './TemplatesChooser';

export default class Panel extends React.Component {
	createCampgain() {
		let data = {
			name: $('#inputCampgain').val()
		};

		$('#inputCampgain').val('');

		this.props.createCampgain(data);
	}

	render() {
		return (
			<div class="col-lg-4">

				<div class="panel panel-default">
	  			<div class="panel-heading">Campgain actions</div>
	  				<div class="panel-body">
	  					<div class="row">

							    <div class="col-lg-8">
							      <input type="email" class="form-control" id="inputCampgain" placeholder="Input campgain.."/>
							    </div>

							    <div class="col-lg-4">
							      <button type="submit" onClick={this.createCampgain.bind(this)} class="btn btn-primary btn-block">Create</button>
							    </div>
	  					</div>
	  				</div>
					</div>

				<div class="panel panel-default">
	  			<div class="panel-heading">Send to</div>
	  				<div class="panel-body">
	  					<div class="row">
	  						<div class="col-lg-8">
	  							<TemplatesChooser />
	  						</div>
	  						<div class="col-lg-4">
	  							<button type="button" class="btn btn-primary btn-block" disabled>Send to all</button>
	  						</div>
	  					</div>
	  				</div>
					</div>

					<div class="panel panel-default">
					 <div class="panel-heading">Upload recipients</div>
		  			<div class="panel-body">
		  				<div class="row">
		  					<div class="col-lg-8">
									 <div class="form-group">
									    <input type="file" id="csvUpload"/>
									    <p class="help-block">Must be .csv file (name, email)</p>
		  							</div>
		  					</div>
		  					<div class="col-lg-4">
		  						<button type="button" class="btn btn-primary btn-block" disabled>Upload</button>
		  					</div>
		  				</div>		
		  			</div>
					</div>

					<div class="panel panel-default">
					 <div class="panel-heading">Add template</div>
		  			<div class="panel-body">
		  				<div class="row">
		  					<div class="col-lg-8">
									 <div class="form-group">
									    <input type="file" id="exampleInputFile"/>
									    <p class="help-block">Must be in .zip and have only html.ejs</p>
		  							</div>
		  					</div>
		  					<div class="col-lg-4">
		  						<button type="button" class="btn btn-primary btn-block" disabled>Add</button>
		  					</div>
		  				</div>		
		  			</div>
					</div>
			</div>
		)
	}
}