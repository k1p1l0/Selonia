'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


function init (event, context, callback) {  
    const TableName = 'selonia-logs';
    
    let params = {
        TableName
    };

    doClient.scan(params, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data.Items);
        }
    });
}

exports.handler = init;