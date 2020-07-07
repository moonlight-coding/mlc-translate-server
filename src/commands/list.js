const Database = require('../backend/services/database.js');
const TimestampsContainer = require('../backend/services/timestamps-container.js');

const prog = require('caporal');

prog
  .version('1.0.0')
  .command('list', 'List the translations available')
  .argument('<config>', 'the config.js file to use')
  //.argument('[env]', 'Environment to deploy on', /^dev|staging|production$/, 'local')
  //.option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  .action(async function(args, options, logger) {

    let config = require('../backend/services/config.js')(args.config);

    // instanciate the services
    let services = {
      database: new Database(config.db),
      timestamps: new TimestampsContainer()
    };

    let available_translations = await services.database.all(`
SELECT DISTINCT locale, project FROM translation
    `);

    for(let translation of available_translations) {
      console.log("- ", translation['locale'] + " " + translation['project']);
    }

  });
