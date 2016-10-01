'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-recipients';

function init (event, context, callback) {	
	if (typeof event.recipients === 'object') {
		unpackageItems(event.recipients, callback);
	} else {
		callback(null, 'We need an array of recipients!');
	}
}

function sendItems(params, cb) {
  doClient.batchWrite(params, function(err, data) {
	  if (err) {
	  	cb(err, null);
	  }
	  else {
	 		cb(null, data);
	  }
	});
}

function makeRecipients (arrayRecipients) {
	return arrayRecipients.map((recipient) => {
		return {
			id: recipient.id,
			email: recipient.email,
			name: recipient.name,
			campgainId: recipient.campgainId,
			templateName: recipient.templateName,
		};
	});
}

function makeItems (recipients) {
	return recipients.map((recipient) => {
		return {
			PutRequest: {
				Item: recipient
			}
		};
	});
}

function prepareRequest (items) {
	return {
    'RequestItems': {
      [TableName]: items
    },

    'ReturnConsumedCapacity': 'TOTAL',

    'ReturnItemCollectionMetrics': 'SIZE'
	}
}

function unpackageItems (packageRecipients, cb) {
	let recipients, items, params

	recipients = makeRecipients(packageRecipients);
	items = makeItems(recipients);
	params = prepareRequest(items);

	return sendItems(params, cb);
}

exports.handler = init;