'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-templates';

function init (event, context, callback) {	
	let params = {
		Item: {
			id: Date.now(),
			name: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ").split('/').splice(1, 1))
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