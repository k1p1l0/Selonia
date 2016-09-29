import React from 'react';

export default class TemplatesChooserContainer extends React.Component {
	constructor() {
		super();

		this.state = {
			templates: []
		};
	}

	componentWillMount() {
		this.loadTemplates();
		setInterval(this.loadTemplates.bind(this), 5000);
	}

	loadTemplates() {
    $.ajax({
      type: 'GET',
			url: `${this.props.source}/templates`,

			success: function(data) {
				this.setState({
					templates: data.Items
				}, function() {
					this.forceUpdate()
				}.bind(this));
			}.bind(this)
    });
  }

  render() {
  	return <TemplatesChooser style={this.props.style} placeholder={this.props.placeholder} templates={this.state.templates} selectName={this.props.selectName} load={this.loadTemplates.bind(this)} />
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
		  style: this.props.style
		};

		if (options.length === 0) selectProps.disabled = true;

		return (
			<select name={this.props.selectName} class="form-control" {...selectProps}>
			    <option disabled value="def">{this.props.placeholder || 'Choose template'}</option>
			    {options}
			</select>
		)
	}
}