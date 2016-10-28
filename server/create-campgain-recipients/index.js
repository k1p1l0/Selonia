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
	// console.log(params);

	// var params = {
	//   TableName
	// };

	// console.log('DESCRIBE TABLE');
	// doClient.describeTable(params, function(err, data) {
	//   if (err) {
	//   	console.log(err, err.stack); // an error occurred
	//   } 
	//   else {
	//   	console.log(data); 
	//   }              // successful response
	// });

  doClient.batchWrite(params, function(err, data) {
	  if (err) {
			console.log('ERROR IN batchWrite: ', err);

			if (~err.indexOf('ProvisionedThroughputExceededException')) {
				setTimeout(function() {
					console.log('try to loop it');
					
					sendItems(params, cb);
				}, 5000);
			}

	  	cb(err, null);
	  }
	  else {
			if (data.UnprocessedItems.length > 0) {
				console.log('Data Error: ', data);
				// setTimeout(function() {
				// 	sendItems(prepareRequest(data.UnprocessedItems), cb);
				// }, 5000);
			}

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