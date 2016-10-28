'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const deleteFromS3 = (name, cb) => {
    let s3 = new AWS.S3();

    let params = {
      Bucket: 'selonia.static', /* required */
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
      if (err) cb(err, err.stack); // an error occurred
      else     cb(null, data);           // successful response
    });
};

function init (event, context, callback) {
    const TableName = 'selonia-templates';
    
    var params = {
        TableName,
        Key: {
            name: event.name,
        }
    };
    
    docClient.delete(params, function(err) {
        if (err) {
           callback(err, null);
        } else {
           deleteFromS3(event.name, callback);
        }
    });
}


exports.handler = init;