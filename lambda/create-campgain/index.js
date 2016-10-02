'use strict';

const AWS = require('aws-sdk');
const doClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

const TableName = 'selonia-campaigns';

function init (event, context, callback) {	
	let params = {
		Item: {
			id: parseInt(event.name.hashCode()),
			name: event.name
		},

		TableName
	};

	doClient.put(params, (err) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, params.Item);
		}
	});
}

exports.handler = init;

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};