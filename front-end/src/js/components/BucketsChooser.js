import React from 'react';

export default class BucketsChooser extends React.Component {
	render() {
		var options = this.props.values.map(function(value) {
      return (
				<option value={value.name} key={value.CreationDate}>{value.Name}</option>
      );
    }.bind(this));

		return (
			<select class="form-control" defaultValue="def">
			    {options}
			</select>
		)
	}
}