'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.region = 'eu-west-1';

exports.getTemplate = (params, tmpFolder, callback) => {
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