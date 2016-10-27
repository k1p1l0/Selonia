'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const shortid = require('shortid');

AWS.config.update({
  accessKeyId: 'AKIAJ5QNK3SH4E2TFHQQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const FUNCTION_NAME = 'create-campgain-recipients';

function getCsv (params, callback) {
  var s3 = new AWS.S3(params),
  		reader, writer;
  		
  writer = fs.createWriteStream(path.join('/tmp', 'file.csv'));
	reader = s3.getObject(params).createReadStream().pipe(writer);

	reader.on('finish', function () { callback() });
}

function readCsv (config, params, callback) {
		let arrayOfUsers = [];
		let users = [];
		// let lengthA = [];

    fs.createReadStream(config.csv_file).pipe(parse())
    .on('data', function(csvrow) {
    		// lengthA.push(i);

        let user = csvrow.toString().split(','),
        		hashUser = {
        			id: shortid.generate(),
        			name: user[0],
        			email: user[1],
        			campgainId: params.keyCampgainId,
        			templateName: params.keyTemplateName
        		};

        if (users.length < 25) {
        	users.push(hashUser);
        } else {
        	arrayOfUsers.push(users);

        	users = [];

        	users.push(hashUser);
        }
    })
    .on('end',function() {
    	if (arrayOfUsers[arrayOfUsers.length - 1] !== users) { //push the last pack of users
    		arrayOfUsers.push(users);
    	}

    	callback(arrayOfUsers);
    });
}

function writeUsers(arrayOfUsers, callback) {
	var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

	arrayOfUsers.forEach(function (usersPack) {
		let params = {
			FunctionName: FUNCTION_NAME,
	  	InvokeArgs: JSON.stringify({recipients: usersPack}, null, 2) // pass params
		};

		lambda.invokeAsync(params, function(error, data) {
			  if (error) {
			  	// console.log(error);

			  	// error.UnprocessedItems.selonia-recipients.forEach(function(item) {
			  	// 	console.log(item);
			  	// });

			  	callback(error, null);
			  }

			  callback(null, data);
		});
	});
}

function init (event, context, callback) {	
	let params = {
			keyCampgainId: parseInt(decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ").split('/').splice(1, 1))),
			keyTemplateName: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ").split('/').splice(2, 2).shift()),
			keyfileName: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ").split('/').splice(3, 3))
		};

	let locals = {
		Bucket: 'selonia.static',
    Key: `temp/${params.keyCampgainId}/${params.keyTemplateName}/${params.keyfileName}`
	};

	getCsv(locals, function() {
		readCsv({csv_file: '/tmp/file.csv'}, params, function(users) {
			writeUsers(users, callback);
		});
	});
}

// init(null, null, callMeBaby);

// function callMeBaby (a, b) {
// 	// console.log(a);
// 	console.log(b);
// }

exports.handler = init;