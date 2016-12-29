### Installation On Client Side ###
> npm install  
npm run dev

Now edit ```client.js``` change API_URL to your endpoint api on AWS (Api Gateway)

### How do upload the template to Selonia? ###
* It must be  ```.ejs``` type of file (NOT .HTML)
* You can use these variables inside the template ( ```<%= name %> ``` or  ```<%= email %> ```)


### How do upload the CSV list? ###
* It must be ``.csv`` type of file
* First row is name
* Second row is email
