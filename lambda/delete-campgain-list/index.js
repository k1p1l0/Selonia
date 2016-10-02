'use strict';

const AWS = require('aws-sdk');
const async = require('async')

const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  accessKeyId: 'AKIAJ5QNK3SH4E2TFHQQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const FUNCTION_NAME = 'delete-campgain-recipient';

function init (event, context, callback) {
    const TableName = 'selonia-recipients';
    const campgainId = parseInt(event.id);

    var params = {
        TableName,
        FilterExpression: "#campgainId = :id",
        ExpressionAttributeNames: {
            "#campgainId": "campgainId",
        },
        ExpressionAttributeValues: {
             ":id": campgainId
        }
    };
    
    docClient.scan(params, function(err, data) {
        if (err) {
           callback(err, null);
        } else {
        	async.each(data.Items, function (recipient) {
        		deleteRecipient(recipient);
        	});

        	if (event.deleteCampgain) {
        		deleteList(campgainId);
        	}

        	callback(null, 'done');
        }
    });
}

function deleteRecipient (recipient) {
	const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

	let params = {
		FunctionName: FUNCTION_NAME,
  	Payload: JSON.stringify({id: recipient.id}, null, 2) // pass params
	};

	lambda.invoke(params, function(error, data) {
		  if (error) {
		  	console.log(error);
		  } else {
		  	console.log(data);
		  }
	});
}

function deleteList (id) {
	const TableName = 'selonia-campaigns';

	var params = {
        TableName,
        Key: {
          id
        }
    	};
    
  docClient.delete(params, function(err, data) {
      if (err) {
         console.log(err);
      } else {
         console.log(data);
      }
  });
}


exports.handler = init;