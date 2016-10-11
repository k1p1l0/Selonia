'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

exports.getTemplate = (params, tmpFolder, callback) => {
  var s3 = new AWS.S3(params),
  		reader, writer, pathToFile;
  		
  pathToFile = params.Key.split('/').splice(2, 2).join('/');

	fs.mkdtemp(tmpFolder, (err, folder) => {
	  if (err) throw err;

	  fs.writeFile(path.join(folder, pathToFile), '', function() {
			writer = fs.createWriteStream(path.join(folder, pathToFile));
			reader = s3.getObject(params);

			reader.on('send', function() {		
				callback(folder);
			});

			reader.on('httpData', function(chunk) { writer.write(chunk); });
			reader.on('httpDone', function() { writer.end(); });
			reader.send();
	  });
	});
};