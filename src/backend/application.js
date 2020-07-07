const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


module.exports = (config, services) => {

  const app = express();

  // parse application/json requests body automatically
  app.use(bodyParser.json({
    limit: '50mb'
  }));

  // allow all CORS origins.
  // TODO: should be configured via config.js
  app.use(cors());

  // we load the available endpoints
  require('./endpoints/query.js')(app, config, services);
  require('./endpoints/translation/create.js')(app, config, services);
  require('./endpoints/translation/remove.js')(app, config, services);
  require('./endpoints/translation/list.js')(app, config, services);
  require('./endpoints/translation/get.js')(app, config, services);
  require('./endpoints/import.js')(app, config, services);
  require('./endpoints/export.js')(app, config, services);

  // start the server
  app.listen(config.port, config.host);

  // show that the server is started
  console.log(`[x] server started, available at ${config.url}:${config.port}`);
};
