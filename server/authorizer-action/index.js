'use strict';

const AWS = require('aws-sdk');
const nJwt = require('njwt');

AWS.config.update({
  accessKeyId: 'AKIAIIYCVUYUBLN5THOQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const generatePolicy = (principalId, effect, resource) => {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};


const decryptSign = (key, callback) => {
    let kms = new AWS.KMS();

    var params = {
        CiphertextBlob: key /* required */
    };

    kms.decrypt(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            callback(data.Plaintext);
        }
    });
}

const getKey = (callback) => {
    let doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

    let TableName = 'selonia-users';
    
    let params = {
        TableName,
        Limit: 1
    };

    doClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            callback(data.Items[0].key, data.Items[0].token);
        }
    });
};


exports.handler = function(event, context) {
    var client_token = event.authorizationToken;
    // Call oauth provider, crack jwt token, etc.
    // In this example, the token is treated as the status for simplicity.

    getKey(function (key, token) {
        if (client_token === token) {
            decryptSign(key, function (sign) {
                nJwt.verify(token, sign, function (err) {
                  if (err) {
                    context.succeed(generatePolicy('user', 'Deny', event.methodArn));
                  } else {
                    context.succeed(generatePolicy('user', 'Allow', event.methodArn));
                  }
                });
            });
        } else {
            context.fail("Unauthorized");
        }
    });
};

