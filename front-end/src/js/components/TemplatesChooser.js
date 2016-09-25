import React from 'react';

export default class TemplatesChooser extends React.Component {
	render() {
		return (
			<select name="templates" class="form-control" defaultValue="def">
			    <option disabled value="def">Choose template</option>
			    <option value="origin">Origin</option>
			    <option value="new">New</option>
			</select>
		)
	}
}
