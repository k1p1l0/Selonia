'use strict';

const AWS = require('aws-sdk');
const shortid = require('shortid');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-logs';

function init (event, context, callback) {	
	let params = {
		Item: {
			id: shortid.generate(),
			mailto: event.mailto,
			from: event.from,
			subject: event.subject,
			campaign: event.campaign,
			time: event.time,
			response: event.response
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