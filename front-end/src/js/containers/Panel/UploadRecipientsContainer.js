import React from 'react';

import TemplatesChooserContainer from '../../components/TemplatesChooserContainer';

export default class UploadRecipientsContainer extends React.Component {
	onUpload() {
		AWS.config.update({
		  accessKeyId: 'AKIAJ5QNK3SH4E2TFHQQ',
		  secretAccessKey: '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',
		  region: 'us-east-1'
		});

		let S3 = new AWS.S3();
		let fileChooser = document.getElementById('fileCsv');
		let file = fileChooser.files[0];
		let templateName = $('select[name="csvTemplate"] option:selected').text();
		let campgainName = localStorage.getItem('selectCampgainName');

		if (!file) {
			this.props.setAlert({message:'You must choose a file to upload', type:'info'});
			return;
		}

		if (file.type !== 'application/vnd.ms-excel') {
			this.props.setAlert({message:'File type must be .csv', type:'info'});
			return;
		}

		if (templateName === 'Template') {
			this.props.setAlert({message:'You must choose template', type:'info'});
			return;
		}

		if (campgainName === null) {
			this.props.setAlert({message:'You must choose campaign', type:'info'});
			return;
		}

		let params = {
	  	Bucket: 'selonia.static',
	    Key: 'temp' + '/' + campgainName + '/' + templateName + '/' + file.name,
	    ContentType: file.type,
	    Body: file,
	    ACL: 'public-read'
	  };

	  S3.upload(params, function(err, data) {
	    if (!err) {
	    	(function(This) {
	    		let $fileChooser = $('#fileCsv'),
	    				$buttonFile = $('#buttonCsv');

	    		$buttonFile.removeClass('btn-success');

		    	$fileChooser.replaceWith($fileChooser.val('').clone(true));

	      	This.props.setAlert({message: 'Recipients ' + data.Key.split('/').splice(1,1).pop() + ' uploaded successfully!', type: 'success'});
	    	})(this)
	    }
	  }.bind(this));
	}

	render() {
		return <UploadRecipients onUpload={this.onUpload.bind(this)} source={this.props.source}/>
	}
}

class UploadRecipients extends React.Component {
	triggerFile() {
		$("#fileCsv").trigger('click');
	}

	onChange() {
		$('#buttonCsv').addClass('btn-success');
	}

	render() {
		let campgainName = localStorage.getItem('selectCampgainName');

		return (
			<div class="panel panel-default">
			 <div class="panel-heading">Upload recipients ({campgainName})</div>
  			<div class="panel-body">
  				<div class="row">
  					<div class="col-lg-4">
  							<input type='file' onChange={this.onChange.bind(this)} id="fileCsv" />
						    <input type="button" onClick={this.triggerFile.bind(this)} class="btn" value="Choose csv" id="buttonCsv"/>
  					</div>
  					<div class="col-lg-4">
						    <TemplatesChooserContainer selectName="csvTemplate" source={this.props.source} placeholder="Template" style={{width: '110px'}}/>
						</div>
  					<div class="col-lg-2">
  						<button type="button" class="btn btn-primary btn-block" onClick={this.props.onUpload}>Upload</button>
  					</div>
  				</div>		
  			</div>
			</div>
		)
	}
}