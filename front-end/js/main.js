'use strict';

var API_URL = 'https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod/recipients';

$(function() {
	$.ajax({
		type: 'GET',
		url: API_URL,

		success: function(data) {
			data.Items.forEach(function(item, i) {
				$('.loader').hide();
				$('#main-table').show();
				$('#main-table tbody tr:last').after
				(`
					<tr>
						<td>${i+1}</td>
						<td>${item.name}</td>
						<td>${item.email}</td>
						<td>
							<select name="templates" class="form-control">
						    <option disabled selected>Choose template</option>
						    <option value="origin">Origin</option>
						    <option value="new">New</option>
					   	</select>
						</td>
						<td>
							<button type="button" class="btn btn-success" disabled>Send</button>
							<button type="button" class="btn btn-danger" disabled>Delete</button>
						</td>
					</tr>
				`);
			});
		}
	})
});

$('#addOne').on('click', function() {
	$.ajax({
		type: 'POST',
		url: API_URL,
		data: JSON.stringify({
			"recipients": [{
				"name": $('#nameInput').val(),
				"email": $('#emailInput').val()
			}]
		}),
		contentType: "application/json",
		success: function() {
			location.reload();
		}
	});
});