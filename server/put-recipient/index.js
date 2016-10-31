'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-recipients';

function init (event, context, callback) {	
	let params = {
		Item: {
			id: event.id,
			name: event.name,
			email: event.email,
			templateId: event.templateId,
			campgainId: parseInt(event.campgainId)
		},

		TableName
	};
	
	doClient.put(params, (err) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, params.Item);
		}
	});
}

exports.handler = init;