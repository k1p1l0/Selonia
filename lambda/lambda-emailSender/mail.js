'use strict';

var async = require('async')
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var bucket = require('./bucket');
var config = require('./config');

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: config.keyId,
    secretAccessKey: config.accessId,
    rateLimit: 1
}));

exports.sendMail = (users, template) => {
	const FOLDER = config.folderLambda;

	let locals = {
		Bucket: config.endpointapi,
    Key: `${config.templatesFolder}/${template}/html.${config.templateBuilder}`
	};

	bucket.getTemplate(locals, FOLDER, function() {
			var templateRender = new EmailTemplate(FOLDER);

			async.each(users, function (user) {
				templateRender.render(user, function (err, results) {
				  if (err) {
				    return console.error(err)
				  }

				  transporter.sendMail({
				    from: `Hello from Lambda <${config.email}>`,
				    to: user.email,
				    subject: 'The Unilever exhibit',
				    html: results.html
				  }, function (err, responseStatus) {
				    if (err) {
				      return console.error(err)
				    }

				    console.log(responseStatus)
				  })
				});
			}, null);
	});
};