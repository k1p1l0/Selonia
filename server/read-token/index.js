'use strict';

const AWS = require('aws-sdk');
const nJwt = require('njwt');

const TableName = 'selonia-users';

AWS.config.update({
  accessKeyId: 'AKIAIIYCVUYUBLN5THOQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const readToken = (token, key) => {
	let kms = new AWS.KMS();

	let decryptionParams = {
		CiphertextBlob: key
	};

	kms.decrypt(decryptionParams, function(err, data) {
	  if (err) {
	    console.log(err);

	  } else {
	    let key = data.Plaintext;

	    nJwt.verify(token, key, function(err,verifiedJwt) {
			  if (err) {
			  	console.log('Error');
			    console.log(err); // Token has expired, has been tampered with, etc
			  } else {
			  	console.log('NoErr');
			    console.log(verifiedJwt); // Will contain the header and body
			  }
			});
	  }
	});
};

const readUsers = (callback) => {    
	let doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  let params = {
      TableName,
      Limit: 1
  };

  doClient.scan(params, (err, data) => {
      if (err) {
          callback(err, null);
      } else {
          callback(null, data.Items[0]);
      }
  });
};


const init = (event, context, callback) => {
	readUsers(function(a, b) {
		readToken(b.token, b.key);
	});
};

init(null, null, null);