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
    if (err) {
      console.log(err);
    } else {
      cb();
    }
  });
};

const deleteFromDB = (name, callback) => {
  const TableName = 'selonia-templates';
  
  var params = {
      TableName,
      Key: {
          name
      }
  };
  
  docClient.delete(params, function(err) {
      if (err) {
        console.log(err);
      } else {
        callback();
      }
  });
}

const checkTemplateInRecipients = (templateId, callback) => {
  const TableName = 'selonia-recipients';
  
  var params = {
    TableName
  };
  
  docClient.scan(params, function(err, data) {
      let state = false;

      if (err) {
        callback(state);
      } else {   
        if (data.Items.length > 0) {
         data.Items.forEach(function(recipient) {
          if (recipient.templateId === templateId) {
            state = true;

            return false;
          }
         });
        }

        callback(state);
      }
  });
};

function init (event, context, callback) {
  checkTemplateInRecipients(event.templateId, function(state) {
    if (!state) {
      deleteFromDB(event.name, function() {
        deleteFromS3(event.name, function() {
          callback(null, 'deleted');
        });
      });
    } else {
      callback('We have recipient with this template');
    }
  });
}

exports.handler = init;