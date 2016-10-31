'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const async = require('async');
const EmailTemplate = require('email-templates').EmailTemplate;
const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');
const moment = require('moment');

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
		template = event.templateName,
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
  		time: moment().format('YYYY-MM-DD h:mm:ss a'),
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

	let params = {
		FunctionName: 'create-log',
  	InvokeArgs: JSON.stringify(event, null, 2) // pass params
	};

	lambda.invokeAsync(params, function(error, data) {
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
		if (!templates[recipient.templateId]) {
			templates[recipient.templateId] = [];
		}

		templates[recipient.templateId].push(recipient);
	});

	return templates;
}

function getTemplateNameById (id, cb) {
	let lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: 'us-east-1'});

	let params = {
		FunctionName: 'read-template-by-id',
  	Payload: JSON.stringify({"id": id}, null, 2) // pass params
	};

	lambda.invoke(params, function(error, data) {
		  if (error) {
		  	console.log('error', error);
		  }

		  cb(data.Payload.match(/[^"].*[^"]/)[0]);
	});
}

function init (event, context, callback) {
	let chopedRecipients, templatesId, 
			recipients = event.recipients,
			subject = event.subject,
			from = event.from,
			templateId = event.templateId;

	if (!event.ownTemplate) {
		getTemplateNameById(templateId, function(templateName) {
			sendMail({recipients, subject, from, templateName, callback});
		});
	}

	if (event.ownTemplate) {
		chopedRecipients = ChopRecipients({ recipients });
		templatesId = Object.keys(chopedRecipients);

		templatesId.map(function(templateId) {
				getTemplateNameById(templateId, function(templateName) {

					sendMail({
						recipients: chopedRecipients[templateId], 
						subject,
						from,
						templateName, 
						callback
					});

				}); // end getTemplateNameById
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
//       "templateId": "H1HKe8Zlx"
//     },
//     {
//       "id": 36,
//       "name": "Kirill2",
//       "email": "s0ht@mail.ru",
//       "campgainId": 123,
//       "templateId": "BkTLtj4eg"
//     },
//     {
//       "id": 38,
//       "name": "Kirill2",
//       "email": "s0ht@mail.ru",
//       "campgainId": 123,
//       "templateId": "BkTLtj4eg"
//     }
//   ],
//   "subject": "HELLO!!",
//   "ownTemplate": true,
//   "templateId": "BkTLtj4eg",
//   "from": `Hello from UI <mddb.net@txm.net>`
// }, null, function(a, b) {
//   	console.log(a);
//   	console.log(b);
// });

	// getTemplateNameById(templateId, function(templateName) {
	// 	console.log(templateName);
	// 	// sendMail({recipients, subject, from, templateName, callback});
	// });

exports.handler = init;