import React from 'react';

export default class Templates extends React.Component {
	render() {
		return (
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Name</th>
							<th>Link</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Origin</td>
							<td><a href="#">Download</a></td>
							<td><button class="btn btn-primary">Edit</button></td>
							<td><button class="btn btn-danger">Delete</button></td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}