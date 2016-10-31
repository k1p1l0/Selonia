import React from 'react';

export default class CampaignsChooser extends React.Component {
	changeCampgain (e) {
		let target = e.target.options;

		$('.loader').show();
	  $('#main-table').hide();

		localStorage.setItem('selectCampgainName', target[target.selectedIndex].text);
		localStorage.setItem('selectCampgainId', e.target.value);

		this.props.setSelectedCampgainId(e.target.value);
		// this.props.loadRecipients(0);
	}

	getCampgainSelected () {
		return localStorage.getItem('selectCampgainId');
	}

	render() {
		var options = this.props.values.map(function(value) {
      return (
				<option value={value.id} key={value.id}>{value.name}</option>
      );
    }.bind(this));

		return (
			<select name={this.props.name} class="form-control" onChange={this.changeCampgain.bind(this)} defaultValue="def">
					<option disabled value="def">Choose {this.props.text}</option>
			    {options}
			</select>
		)
	}
}