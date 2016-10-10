'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-campaigns';

function init (event, context, callback) {	
	let params = {
		Item: {
			id: parseInt(event.id),
			name: event.name,
			domain: event.domain
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