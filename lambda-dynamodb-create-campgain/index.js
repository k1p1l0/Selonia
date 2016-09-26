'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-campaigns';

function init (event, context, callback) {	
	doClient.scan({TableName}, (err, data) => {
		let params = {
			Item: {
				id: Date.now(),
				name: event.campgain.name
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

	});
}

exports.handler = init;