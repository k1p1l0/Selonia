'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.region = 'eu-west-1';

function init (event, context, callback) {		
		// let S3 = new AWS.S3();

	 //  let params = {
	 //  	Bucket: 'www.arwenack.com',
	 //    Key: 'selonia/templates' + '/' + templateName + '/' + file.name,
	 //    ContentType: file.type,
	 //    Body: file,
	 //    ACL: 'public-read'
	 //  };

	 //  console.log(params);

		//  // Upload the file
	 //  S3.upload(params, function(err, data) {
	 //    if (err) {
	 //      callback(err, null);
	 //    } else {
	 //      callback(null, data);
	 //    }
	 //  });
	}

	exports.handler = init;