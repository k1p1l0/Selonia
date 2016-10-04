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

	return true;
}

function sendTo({from, to, subject, html}) {
  transporter.sendMail({from, to, subject, html}, function(err, responseStatus) {
	  if (err) {
	    console.error(err) //TO LOGS
	  } else {
	  	console.log(responseStatus) //TO LOGS
	  }
	})
}

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

let init = (event, context, callback) => {
	let chopedRecipients, templatesName, { recipients, subject, from, template } = event;

	if (!event.ownTemplate) {
		sendMail({recipients, subject, from, template, callback});
	}

	if (event.ownTemplate) {
		chopedRecipients = ChopRecipients({ recipients });
		templatesName = Object.keys(chopedRecipients);

		templatesName.map(function(template) {
			sendMail({
				recipients: chopedRecipients[template], 
				subject,
				from,
				template, 
				callback
			});
		});
	}
};


// init({
// 	 "recipients": [
//     {
//       "id": 34,
//       "name": "Kirill",
//       "email": "s0ht@mail.ru",
//       "campgainId": 123,
//       "templateName": "origin"
//     },
//     {
//       "id": 36,
//       "name": "Kirill2",
//       "email": "s0ht@mail.ru",
//       "campgainId": 123,
//       "templateName": "WC2017"
//     }
//   ],
//   "subject": "HELLO!!",
//   "ownTemplate": true,
//   "template": "WC2017",
//   "from": `Hello from UI <mddb.net@txm.net>`
// }, null, function(a, b) {
// //   	console.log(a);
// //   	console.log(b);
// // });

exports.handler = init;