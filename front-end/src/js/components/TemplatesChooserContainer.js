import React from 'react';

export default class TemplatesChooserContainer extends React.Component {
  render() {
  	return <TemplatesChooser 
  		onChange={this.props.onChange} 
  		disabled={this.props.disabled} 
  		style={this.props.style} 
  		placeholder={this.props.placeholder} 
  		templates={this.props.templates} 
  		selectName={this.props.selectName} />
  }
}

class TemplatesChooser extends React.Component {
	render() {
		var options = this.props.templates.map(function(value) {
      return (
				<option value={value.id} key={value.id}>{value.name}</option>
      );
    }.bind(this));

    var selectProps = {
		  defaultValue: 'def',
		  onChange: this.props.onChange || null,
		  style: this.props.style
		};

		if (this.props.disabled) selectProps.disabled = true;

		return (
			<select name={this.props.selectName} id={this.props.selectName} class="form-control" {...selectProps}>
			    <option disabled value="def">{this.props.placeholder || 'Choose template'}</option>
			    {options}
			</select>
		)
	}
}