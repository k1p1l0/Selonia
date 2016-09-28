import React from 'react';

import TemplatesChooser from '../components/TemplatesChooser';

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
	  			<div class="panel-heading">Campaigns actions</div>
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
								<TemplatesChooser options={this.props.templates} />
	  						</div>
	  						<div class="col-lg-4">
	  							<button type="button" class="btn btn-primary btn-block" disabled>Send to all</button>
	  						</div>
	  					</div>
	  				</div>
					</div>

					<UploadRecipients />
					<UploadTemplateContainer setAlert={this.props.setAlert} getTemplates={this.props.getTemplates} />
			</div>
		)
	}
}

class UploadRecipients extends React.Component {
	render() {
				return (
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
			)
	}
}

class UploadTemplateContainer extends React.Component {
	onUpload() {
		AWS.config.update({
		  accessKeyId: 'AKIAJ5QNK3SH4E2TFHQQ',
		  secretAccessKey: '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',
		  region: 'us-east-1'
		});

		let S3 = new AWS.S3();
		let fileChooser = document.getElementById('fileTemplate'),
				templateName = document.getElementById('templateName');

		let file = fileChooser.files[0];

		if (!file) {
			alert('You must choose a file to upload');
			return;
		}

		if (file.name !== 'html.ejs') {
			alert('File must be html.ejs');
			return;
		}

		if (templateName.length > 0) {
			alert('Please enter template name');
			return;
		}

	  let params = {
	  	Bucket: 'selonia.static',
	    Key: 'templates' + '/' + templateName.value + '/' + file.name,
	    ContentType: file.type,
	    Body: file,
	    ACL: 'public-read'
	  };

	  S3.upload(params, function(err) {
	    if (err) {
	      this.props.setAlert(err, 1);
	    } else {
	    	$('#buttonFile').removeClass('btn-success');
	    	templateName.value = "";

	      this.props.setAlert('Template uploaded successfully!');
	    }
	  }.bind(this));
	}

	render() {
		return <UploadTemplate onUpload={this.onUpload.bind(this)} />
	}
}

class UploadTemplate extends React.Component {
	triggerFile() {
		$("#fileTemplate").trigger('click');
	}

	onChange() {
		$('#buttonFile').addClass('btn-success');
	}
	
	render() {
		return (
			<div class="panel panel-default">
			 <div class="panel-heading">Add template</div>
  			<div class="panel-body">
  				<div class="row">
  					<div class="col-lg-4">
  							<input type='file' onChange={this.onChange.bind(this)} id="fileTemplate" />
						    <input type="button" onClick={this.triggerFile.bind(this)}class="btn" value="Choose file" id="buttonFile"/>
  					</div>
  					<div class="col-lg-4">
						    <input type="text" class="form-control" placeholder="Input name.." style={{width: '110px'}} id="templateName"/>
						</div>
  					<div class="col-lg-2">
  						<button type="button" class="btn btn-primary btn-block" onClick={this.props.onUpload}>Add</button>
  					</div>
  				</div>		
  			</div>
			</div>
		)
	}
}