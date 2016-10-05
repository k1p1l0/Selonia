import React from 'react';

export default class BucketsChooser extends React.Component {
	render() {
		var options = this.props.values.filter(function(value) {
     	return ~value.Name.indexOf('www');
    }).map(function(value) {
    	return (
				<option value={value.Name} key={value.CreationDate}>{value.Name}</option>
      );
    });

		return (
			<select id={this.props.name} class="form-control"  style={{width: '110px'}} defaultValue="def">
				<option disabled value="def">Domain</option>
			  {options}
			</select>
		)
	}
}