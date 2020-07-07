const Database = require('../backend/services/database.js');
const TimestampsContainer = require('../backend/services/timestamps-container.js');

const prog = require('caporal');

prog
  .version('1.0.0')
  .command('server', 'Serve the translations')
  .argument('[config]', 'The config.js file to use')
  .action(function(args, options, logger) {

    let config = require('../backend/services/config.js')(args.config);

    // instanciate the services
    let services = {
      database: new Database(config.db),
      timestamps: new TimestampsContainer()
    };

    require('../backend/application.js')(config, services);
  });
