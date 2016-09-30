'use strict';

const bucket = require('./bucket');
const config = require('./config');

let locals = {
	Bucket: config.endpointapi,
  Key: config.templatesFolder + '/origin' + '/html.ejs'
};

bucket.getTemplate(locals, './tmp', callback);

function callback (url) {
	console.log(url);
}