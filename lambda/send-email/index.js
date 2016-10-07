'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const async = require('async');
const EmailTemplate = require('email-templates').EmailTemplate;
const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: 'AKIAIUMCJGSBQ5ZP6QEQ',
    secretAccessKey: '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',
    rateLimit: 1
}));

function getTemplate(params, tmpFolder, callback) {
  var s3 = new AWS.S3(params),
  		reader, writer, pathToFile;
  		
  pathToFile = params.Key.split('/').splice(2, 2).join('/');

  var mkdirSync = function (path) {
	  try {
	    fs.mkdirSync(path);
	  } catch(e) {
	    if ( e.code != 'EEXIST' ) throw e;
	  }
	}

	mkdirSync(tmpFolder);

  fs.writeFile(path.join(tmpFolder, pathToFile), '', function() {
		writer = fs.createWriteStream(path.join(tmpFolder, pathToFile));
		reader = s3.getObject(params);

		reader.on('send', function() {		
			callback(tmpFolder);
		});

		reader.on('httpData', function(chunk) { writer.write(chunk); });
		reader.on('httpDone', function() { writer.end(); });
		reader.send();
  });
};

function sendMail(event) {
	let recipients = event.recipients,
		subject = event.subject,
		from = event.from,
		template = event.template,
		callback = event.callback;

	let locals = {
		Bucket: 'selonia.static',
    Key: `templates/${template}/html.ejs`
	};

	let FOLDER = `/tmp/${template}`;

	getTemplate(locals, FOLDER, function(folder) {
			var templateRender = new EmailTemplate(folder);

			async.each(recipients, function (user) {
				templateRender.render(user, function (err, results) {
				  if (err) {
				    return console.error(err)
				  }

				  sendTo({  
				  	to: user.email,
				  	html: results.html,
				  	solt: user.id,
				  	campaign: user.campgainId,
				  	from,
				  	subject
				  });

				});
			}, null);

			callback(null, 'done!');
	});

	return true;
}


function sendTo(event) {
	let from = event.from,
		to = event.to,
		subject = event.subject,
		campaign = event.campaign,
		html = event.html,
		solt = event.solt;

  transporter.sendMail({from, to, subject, html}, function(err) {
  	let params = {
  		from: '' + from,
  		subject: '' + subject,
  		mailto: '' + to,
  		time: new Date().getTime(),
  		campaign,
  		solt
  	}

	  if (err) {
	    params.response = err.message + '(' + err.statusCode + ')';
	  } else {
	  	params.response = '200';
	  }

	  createLog(params);
	})
}

function createLog(event) {
	var lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: 'us-east-1'});

	// console.log(event);

	let params = {
		FunctionName: 'create-log',
  	Payload: JSON.stringify(event, null, 2) // pass params
	};

	lambda.invoke(params, function(error, data) {
		  if (error) {
		  	console.log(error);
		  }

		  console.log(data);
	});
}

function ChopRecipients(event) {
	let recipients = event.recipients, 
			templates = {};

	recipients.map(function(recipient) {
		if (!templates[recipient.templateName]) {
			templates[recipient.templateName] = [];
		}

		templates[recipient.templateName].push(recipient);
	});

	return templates;
}

function init (event, context, callback) {
	let chopedRecipients, templatesName, 
			recipients = event.recipients,
			subject = event.subject,
			from = event.from,
			template = event.template;

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
//   	console.log(a);
//   	console.log(b);
// });

exports.handler = init;