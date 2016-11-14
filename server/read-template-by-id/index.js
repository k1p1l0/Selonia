'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function init (event, context, callback) {
  const TableName = 'selonia-templates';
  
  var params = {
    TableName,
    FilterExpression: "#id = :id",
    ExpressionAttributeNames: {
        "#id": "id",
    },
    ExpressionAttributeValues: {
         ":id": event.id
    }
  };
  
  docClient.scan(params, function(err, data) {
      if (err) {
         callback(err, null);
      } else {   
         callback(null, data.Items[0].name);
      }
  });
}

exports.handler = init;