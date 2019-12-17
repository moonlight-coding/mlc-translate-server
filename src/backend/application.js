const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const Database = require('./services/database.js');
const TimestampsContainer = require('./services/timestamps-container.js');
const cors = require('cors');

let configFilename = path.join(__dirname, '..', '..', 'config.js');

// the conf file is specified
if(process.argv.length == 3) {
  configFilename = path.resolve(process.argv[2]);
}

// load the config
if(!fs.existsSync(configFilename)) {
  if(process.argv.length == 3)
    console.error(`[!] ${configFilename} file doesn't exist..`);
  else
    console.error("[!] config.js must be created and completed. Use config.example.js to create it.");
  
  process.exit(1);
}

var config = require(configFilename);

const app = express();

// parse application/json requests body automatically
app.use(bodyParser.json({
  limit: '50mb'
}));

// allow all CORS origins. 
// TODO: should be configured via config.js
app.use(cors());

// instanciate the services
let services = {
  database: new Database(config.db),
  timestamps: new TimestampsContainer()
};

// we load the available endpoints
require('./endpoints/query.js')(app, config, services);
require('./endpoints/translation/create.js')(app, config, services);
require('./endpoints/translation/remove.js')(app, config, services);
require('./endpoints/translation/list.js')(app, config, services);
require('./endpoints/translation/get.js')(app, config, services);
require('./endpoints/import.js')(app, config, services);
require('./endpoints/export.js')(app, config, services);

// start the server
app.listen(config.port);

// show that the server is started
console.log(`[x] server started, available at ${config.url}:${config.port}`);
