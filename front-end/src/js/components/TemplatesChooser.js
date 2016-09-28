import React from 'react';

export default class TemplatesChooser extends React.Component {
	shouldComponentUpdate(nextProps) {
		if(this.props.options.length !== nextProps.options.length) {
			console.log('');
			this.forceUpdate();
    	return true;
		}

		return false;
  }

	render() {
		var options = this.props.options.map(function(value) {
      return (
				<option value={value.id} key={value.id}>{value.name}</option>
      );
    }.bind(this));

    var selectProps = {
		  defaultValue: 'def',
		};

		if (options.length === 0) selectProps.disabled = true;

		return (
			<select name={this.props.selectName} class="form-control" {...selectProps}>
			    <option disabled value="def">Choose template</option>
			    {options}
			</select>
		)
	}
}