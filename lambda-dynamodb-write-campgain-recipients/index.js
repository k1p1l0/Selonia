'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-recipients';

function init (event, context, callback) {	
	if (typeof event.recipients === 'object') {
		doClient.scan({TableName}, (err, data) => {
			if (err) {
				callback(err, null);
			} else {
				unpackageItems(event.recipients, data.Count, callback);
			}		
		});
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

function makeRecipients (arrayRecipients, startPosition) {
	return arrayRecipients.map((recipient, i) => {
		return {
			id: startPosition + i + 1,
			email: recipient.email,
			name: recipient.name,
			campgainId: recipient.campgainId,
			templateId: recipient.templateId,
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

function unpackageItems (packageRecipients, startPosition, cb) {
	let recipients, items, params

	recipients = makeRecipients(packageRecipients, startPosition);
	items = makeItems(recipients);
	params = prepareRequest(items);

	return sendItems(params, cb);
}

exports.handler = init;