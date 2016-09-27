'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-campaigns';

function init (event, context, callback) {	
	let params = {
		Item: {
			id: Date.now(),
			name: event.name
		},

		TableName
	};

	doClient.put(params, (err, data) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, data);
		}
	});
}

exports.handler = init;