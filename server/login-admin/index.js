'use strict';

const AWS = require('aws-sdk');

const giveToken = (event, callback) => {
	var lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: 'us-east-1'});

	let params = {
		FunctionName: 'createToken',
  	Payload: JSON.stringify(event, null, 2) // pass params
	};

	lambda.invoke(params, function(error, data) {
	  if (error) {
	  	console.log(error);
	  }

	  callback(data);
	});
};

const readAdmin = (callback) => {
	let doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

	let TableName = 'selonia-users';

	let params = {
		TableName,
		Limit: 1
	};

	doClient.scan(params, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			callback(data);
		}
	});
}

const init = (event, context, callback) => {
	let username = event.username;
	let password = event.password;

	readAdmin(function(admin) {
		if (username === admin.Items[0].username && password === admin.Items[0].password) {
			giveToken({username, password}, function(result) {
				callback(null, {
					authenticated: true,
					token: result.Payload
				});
			});
		} else {
			callback(null, {
				authenticated: false
			});
		}
	});
};

exports.handler = init;