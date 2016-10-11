'use strict';

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAIUMCJGSBQ5ZP6QEQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

function init (event, context, callback) {	
	var s3 = new AWS.S3();

		s3.listBuckets(function(err, data) {
		  if (err) { console.log("Error:", err); }
		  else {
		  	callback(null, data.Buckets);
		  }
	});
}

exports.handler = init;