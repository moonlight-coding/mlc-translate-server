const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const Database = require('./services/database.js');

let configFilename = 'config.js';

if(process.argv.length == 3) {
  configFilename = process.argv[2];
}

// load the config
const configPath = path.join(__dirname, '..', '..', configFilename);

if(!fs.existsSync(configPath)) {
  console.error("[!] config.js must be created and completed. Use config.example.js to create it.");
  process.exit(1);
}

var config = require(configPath);

const app = express();

// parse application/json requests body automatically
app.use(bodyParser.json());

// all the files in web/ are public
app.use(express.static('web'));

// instanciate the services
let services = {
  database: new Database(config.db)
};

// we load the available endpoints
require('./endpoints/query.js')(app, config, services);
require('./endpoints/translation/create.js')(app, config, services);
require('./endpoints/translation/remove.js')(app, config, services);
require('./endpoints/translation/list.js')(app, config, services);

// start the server
app.listen(config.port);

// show that the server is started
console.log(`[x] server started, available at ${config.url}:${config.port}`);
