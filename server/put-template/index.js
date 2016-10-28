'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const s3 = new AWS.S3();

const TableName = 'selonia-templates';
const Bucket = 'selonia.static';

const copyTheObject = (NewName, OldName, callback) => {
    const s3 = new AWS.S3();

	var params = {
	  Bucket,
	  CopySource: `${Bucket}/templates/${OldName}/html.ejs`, 
	  Key: `templates/${NewName}/html.ejs`,
	};

	s3.copyObject(params, function(err) {
	  if (err) {
	  	console.log(err);
	  }
	  else {
	  	callback(OldName);
	  }
	});
};

const deleteFromS3 = (name, id, cb) => {
    let params = {
      Bucket,
      Delete: { /* required */
        Objects: [ /* required */
          {
            Key: `templates/${name}/html.ejs` /* required */
          },
          {
            Key: `templates/${name}`
          }
        ]
      }
    };

    s3.deleteObjects(params, function(err, data) {
      if (err) {
				cb(err, err.stack); // an error occurred
			}
      else {
    		let params = {
	        TableName,
	        Key: {
	          name
	        }
  			};
    
		    doClient.delete(params, function(err) {
		        if (err) {
		           cb(err, null);
		        } else {
		           cb(null, name);
		        }
		    });
      }
    });
};

function init (event, context, callback) {	
	let params = {
		Item: {
			id: ''+event.id,
			name: event.name,
		},

		TableName
	};

	doClient.put(params, (err) => {
		if (err) {
			callback(err, null);
		} else {
			copyTheObject(event.name, event.oldname, function(name) {
				deleteFromS3(name, event.id, callback);
			});
		}
	});
}

// init({
//     "id": "SyOTdB-le",
//     "name": "kiska",
//     "oldname": "Testname"
// }, null, function(a, b) {
// 	console.log(a);
// 	console.log(b);
// })

exports.handler = init;