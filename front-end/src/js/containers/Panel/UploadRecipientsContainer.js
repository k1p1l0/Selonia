import React from 'react';

import TemplatesChooserContainer from '../../components/TemplatesChooserContainer';

export default class UploadRecipientsContainer extends React.Component {
	onUpload() {
		//
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
						    <TemplatesChooserContainer source={this.props.source} placeholder="Template" style={{width: '110px'}}/>
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