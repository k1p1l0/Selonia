'use strict';

const async = require('async');
const EmailTemplate = require('email-templates').EmailTemplate;
const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');
const bucket = require('./bucket');

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: 'AKIAIUMCJGSBQ5ZP6QEQ',
    secretAccessKey: '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',
    rateLimit: 1
}));

function sendMail({recipients, subject, from, template, callback}) {
	let locals = {
		Bucket: 'selonia.static',
    Key: `templates/${template}/html.ejs`
	};

	let FOLDER = `./tmp/${template}`;

	bucket.getTemplate(locals, FOLDER, function(folder) {
			var templateRender = new EmailTemplate(folder);

			async.each(recipients, function (user) {
				templateRender.render(user, function (err, results) {
				  if (err) {
				    return console.error(err)
				  }

				  sendTo({  
				  	to: user.email,
				  	html: results.html,
				  	from,
				  	subject
				  });

				});
			}, null);

			callback(null, 'done!');
	});
}

function sendTo({from, to, subject, html}) {
  transporter.sendMail({from, to, subject, html}, function(err, responseStatus) {
	  if (err) {
	    console.error(err)
	  } else {
	  	console.log('response');
	  	console.log(responseStatus)
	  }
	})
}

let init = (event, context, callback) => {
	let chopedRecipients = ChopRecipients({recipients: event.recipients});
	let templatesName = Object.keys(chopedRecipients);

	templatesName.map(function(template) {
		sendMail({
			recipients: chopedRecipients[template], 
			subject: event.subject,
			from: event.from,
			template, 
			callback
		});
	});
};

function ChopRecipients({recipients}) {
	var templates = {};

	recipients.map(function(recipient) {
		if (!templates[recipient.templateName]) {
			templates[recipient.templateName] = [];
		}

		templates[recipient.templateName].push(recipient);
	});

	return templates;
}

init({
	 "recipients": [
    {
      "id": 34,
      "name": "Kirill",
      "email": "s0ht@mail.ru",
      "campgainId": 123,
      "templateName": "origin"
    },
    {
      "id": 36,
      "name": "Kirill2",
      "email": "s0ht@mail.ru",
      "campgainId": 123,
      "templateName": "WC2017"
    }
  ],
  "subject": "HELLO!!",
  "from": `Hello from Lambda <mddb.net@txm.net>`
}, null, function(a, b) {
  	console.log(a);
  	console.log(b);
});

exports.handler = init;