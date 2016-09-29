import React from 'react';

export default class UploadTemplateContainer extends React.Component {
	onUpload() {
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
			<div class="panel panel-default">
			 <div class="panel-heading">Add template</div>
  			<div class="panel-body">
  				<div class="row">
  					<div class="col-lg-4">
  							<input type='file' onChange={this.onChange.bind(this)} id="fileTemplate" />
						    <input type="button" onClick={this.triggerFile.bind(this)} class="btn" value="Choose file" id="buttonFile"/>
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