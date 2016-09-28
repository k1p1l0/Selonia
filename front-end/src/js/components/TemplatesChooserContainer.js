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
	}

	loadTemplates() {
		console.log(123);

    $.ajax({
      type: 'GET',
			url: "https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod/templates",

			success: function(data) {
				console.log(data);
				this.setState({
					templates: data.Items
				});
			}.bind(this)
    });
  }

	render() {
		return (
			<TemplatesChooser options={this.state.templates} />
		)
	}
}

class TemplatesChooser extends React.Component {
	render() {
		var options = this.props.options.map(function(value) {
      return (
				<option value={value.id} key={value.id}>{value.name}</option>
      );
    }.bind(this));

		return (
			<select name="templates" class="form-control" defaultValue="def">
			    <option disabled value="def">Choose template</option>
			    {options}
			</select>
		)
	}
}