import React from 'react';

export default class CampgainsChooser extends React.Component {
	changeCampgain (e) {
		console.log(1);
		localStorage.setItem('selectCampgain', e.target.value);

		this.props.setSelectedId(e.target.value);
	}

	getCampgainSelected () {
		return localStorage.getItem('selectCampgain');
	}

	render() {
		var options = this.props.values.map(function(value) {
      return (
				<option value={value.id} key={value.id} selected={this.getCampgainSelected() == value.id}>{value.name}</option>
      );
    }.bind(this));

		return (
			<select name={this.props.name} class="form-control" onChange={this.changeCampgain.bind(this)} defaultValue={this.getCampgainSelected()}>
					<option disabled value="null">Choose {this.props.text}</option>
			    {options}
			</select>
		)
	}
}
