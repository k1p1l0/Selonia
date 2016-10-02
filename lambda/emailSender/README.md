Hello Boss!

Locally it worker. Now It use S3/SES. But when I tryied upload it like a Lambda.

It have error -> {
  "errorMessage": "Unexpected token {"
}

Will fix it today.

## How setup it locally? ##
1. npm install
2. change the emails in *campaign.csv* (**IMPORTANT: They should be verified by our local AWS account!**)
4. Run in the terminal next command
```
#!nodejs

node --harmony_destructuring index.js
```
5. Check your mail! :)