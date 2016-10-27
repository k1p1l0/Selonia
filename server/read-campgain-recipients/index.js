'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function init (event, context, callback) {
    const TableName = 'selonia-recipients';
    
    var params = {
        TableName,
        FilterExpression: "#campgainId = :id",
        ExpressionAttributeNames: {
            "#campgainId": "campgainId",
        },
        ExpressionAttributeValues: {
             ":id": parseInt(event.id)
        }
    };
    
    docClient.scan(params, function(err, data) {
        if (err) {
           callback(err, null);
        } else {
          let limitedRecipients = data.Items.splice(0, 300);
          let count = data.Count;
           
           callback(null, {Items: limitedRecipients, count});
        }
    });
}


exports.handler = init;