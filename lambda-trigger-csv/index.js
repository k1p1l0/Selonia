'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const fs = require('fs');
const path = require('path');

AWS.config.region = 'eu-west-1';

function getCsv (params, tmpFolder, callback) {
  var s3 = new AWS.S3(params),
  		reader, writer, pathToFile;
  		
  pathToFile = params.Key.split('/').splice(2, 2).join('/');
  
	writer = fs.createWriteStream(path.join(tmpFolder, pathToFile));
	reader = s3.getObject(params);

	reader.on('send', function() {		
		callback();
	});

	reader.on('httpData', function(chunk) { writer.write(chunk); });
	reader.on('httpDone', function() { writer.end(); });
	reader.send();
};

function init (event, context, callback) {	
	let keyTemplateName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ").split('/').splice(2, 2)),
			keyCampgainName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ").split('/').splice(2, 2)),
			fullPath = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
}

exports.handler = init;