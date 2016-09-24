'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

function init (event, context, callback) {
	const TableName = 'selonia-recipients';
	
	if (typeof event.recipients === 'object') {
		doClient.scan({TableName}, (err, data) => {
			if (err) {
				callback(err, null);
			} else {
					let recipients = makeRecipients(event.recipients, data.Count),
							items = makeItems(recipients);

					sendItems({
				    RequestItems: {
				      'selonia-recipients': items
				    },

				    'ReturnConsumedCapacity': 'TOTAL',

				    'ReturnItemCollectionMetrics': 'SIZE'
					});
			}		
		});
	} else {
		callback(null, 'We need an array of recipients!');
	}
}

function sendItems(params) {
  console.log("SENDING:");
  console.log(params);

  doClient.batchWrite(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function makeRecipients (arrayRecipients, startPosition) {
	let recipientArray = [];

	arrayRecipients.forEach((recipient, i) => {
		let Item = {
			id: startPosition + i + 1,
			email: recipient.email,
			name: recipient.name
		};

		recipientArray.push(Item);
	});

	return recipientArray;
}

function makeItems (recipients) {
	let items = [];

	recipients.forEach((recipient) => {
	    items.push({
	        PutRequest: { 
	        	Item: recipient 
	        }
	    })
	});

	return items;
}

exports.handler = init;