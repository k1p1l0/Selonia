'use strict';

const AWS = require('aws-sdk');
const nJwt = require('njwt');
const secureRandom = require('secure-random');

const TableName = 'selonia-users';
const signingKey = 'f7ed992c-97a2-404f-b1a8-fc7a7cc2cfa5'

AWS.config.update({
  accessKeyId: 'AKIAIIYCVUYUBLN5THOQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const createToken = (claims, sign) => {
  return nJwt.create(claims, sign);
};

const encryptToken = (callback) => {
  let kms = new AWS.KMS();

  let sign = secureRandom(10, {type: 'Buffer'}),
      key, token;

  let params = {
    KeyId: signingKey, /* required */
    Plaintext: sign /* required */
  };

  kms.encrypt(params, function(err, data) {
    if (err) {
      console.log(err);
    } // an error occurred
    else {
      key = data.CiphertextBlob;

      token = createToken({
        scope: "admin"
      }, sign).compact();

      callback({token, key});
    }
  });
};

const writeToDB = (event, callback) => {
  let doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  let params = {
    Item: {
      username: event.username,
      password: event.password,
      token: event.token,
      key: event.key
    },

    TableName
  };

  doClient.put(params, (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, event.token);
    }
  });
};

const init = (event, context, callback) => {  
  encryptToken(function (result) {
    result.username = event.username;
    result.password = event.password;

    writeToDB(result, callback);
  });
}

init({username: 'admin'}, null, function(a, b) {
  console.log(b);
});

exports.handler = init;