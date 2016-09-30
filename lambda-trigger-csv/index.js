'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

AWS.config.update({
  accessKeyId: 'AKIAJ5QNK3SH4E2TFHQQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

function getCsv (params, callback) {
  var s3 = new AWS.S3(params),
  		reader, writer;
  		
  writer = fs.createWriteStream(path.join('/tmp', 'file.csv'));
	reader = s3.getObject(params).createReadStream().pipe(writer);

	reader.on('finish', function () { callback() });
}

function readCsv (config, params, callback) {
		let users = [];
    fs.createReadStream(config.csv_file).pipe(parse())
    .on('data', function(csvrow) {
        let user = csvrow.toString().split(','),
        		hashUser = {
        			id: parseInt(user[0].hashCode()),
        			name: user[0],
        			email: user[1],
        			campgainId: params.keyCampgainId,
        			templateName: params.keyTemplateName
        		};
        users.push(hashUser);
    })
    .on('end',function() {
    	callback(users);
    });
}

function writeUsers(event, callback) {
	var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
	console.log(event);
	let params = {
		FunctionName: 'write-dynamdb',
  	Payload: JSON.stringify(event, null, 2) // pass params
	};

	lambda.invoke(params, function(error, data) {
		  if (error) {
		  	console.log(error);
		  	callback(error, null);
		  }

		  callback(null, data);
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
			writeUsers({recipients: users}, callback);
		});
	});
}

exports.handler = init;

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};