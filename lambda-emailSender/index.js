'use strict';

const fs = require('fs');
const parse = require('csv-parse');
const mailer = require('./mail');

let jsFile = {
  csv_file: './campaign.csv',
  html_email: 'origin',
};

// sendMail(jsFile);
function sendMail (config, context) {
		let users = [];

    fs.createReadStream(config.csv_file).pipe(parse())
    .on('data', function(csvrow) {
        let user = csvrow.toString().split(','),
        		hashUser = {
        			name: user[0],
        			email: user[1]
        		};

        users.push(hashUser);
    })
    .on('end',function() {
  		mailer.sendMail(users, config.html_email);

      // context.succeed("Send emails succeeded");
      console.log('Thats all folks!');
    });
}

exports.handler = (event, context, callback) => {
  console.log("Incoming: ", event);

  sendMail(jsFile, context);

  callback(null, 'Send!');
};