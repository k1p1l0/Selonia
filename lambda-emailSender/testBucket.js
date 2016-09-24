'use strict';

const bucket = require('./bucket');
const config = require('./config');

let locals = {
	Bucket: config.endpointapi,
  Key: config.templatesUri + 'origin' + '/html.ejs'
};

bucket.getTemplate(locals, callback);

function callback (url) {
	console.log(url);
}