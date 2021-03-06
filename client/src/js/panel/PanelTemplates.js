import React from 'react';

export default class PanelTemplate extends React.Component {
	onUpload({target}) {
		AWS.config.update({
		  accessKeyId: 'AKIAJ5QNK3SH4E2TFHQQ',
		  secretAccessKey: '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',
		  region: 'us-east-1'
		});

		let S3 = new AWS.S3();
		let fileChooser = document.getElementById('fileTemplate');

		let file = fileChooser.files[0];

		if (!file) {
			this.props.setAlert({message:'You must choose a file to upload', type:'info'});
			return;
		}

		if (file.name !== 'html.ejs') {
			this.props.setAlert({message:'File must be html.ejs', type:'info'});
			return;
		}

		if (templateName.value <= 0) {
			this.props.setAlert({message:'Please enter the template name', type:'info'});
			return;
		}

		this.props.toggleLoadIcon(target, 'Upload');

	  let params = {
	  	Bucket: 'selonia.static',
	    Key: 'templates' + '/' + templateName.value + '/' + file.name,
	    ContentType: file.type,
	    Body: file,
	    ACL: 'public-read'
	  };

	  S3.upload(params, function(err, data) {
	    if (!err) {
	    	(function(This) {
	    		let $fileChooser = $('#fileTemplate'),
	    				$buttonFile = $('#buttonFile');

	    		$buttonFile.removeClass('btn-success');
		    	templateName.value = "";

		    	$fileChooser.replaceWith($fileChooser.val('').clone(true));

					This.props.toggleLoadIcon(target, 'Upload');
		    	//This.props.startIntervalTemplateLoad();
	      	This.props.setAlert({message: 'Template ' + data.Key.split('/').splice(1,1).pop() + ' uploaded successfully!', type: 'success'});
	    	})(this)
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
			<div class="col-lg-6">
				<div class="panel panel-default">
				 <div class="panel-heading">Upload template</div>
	  			<div class="panel-body">
	  				<div class="row">
	  					<div class="col-lg-4">
  							<input type='file' onChange={this.onChange.bind(this)} id="fileTemplate" />
						    <input type="button" onClick={this.triggerFile.bind(this)} class="btn btn-warning btn-block" value="Choose file" id="buttonFile"/>
	  					</div>
	  					<div class="col-lg-4">
							    <input type="text" class="form-control" placeholder="Input name.." id="templateName"/>
							</div>
	  					<div class="col-lg-4">
	  						<button type="button" class="btn btn-primary btn-block" style={{'width':'90%'}} onClick={this.props.onUpload}>Add</button>
	  					</div>
	  				</div>		
	  			</div>
				</div>
			</div>
		)
	}
}