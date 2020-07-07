const Database = require('../backend/services/database.js');
const TimestampsContainer = require('../backend/services/timestamps-container.js');
const fs = require('fs');

const prog = require('caporal');

prog
  .version('1.0.0')
  .command('export', 'Export the translations')
  .argument('<config>', 'the config.js file to use')
  .argument('<locale>', 'the locale')
  .argument('<project>', 'the project')
  .argument('[outfile]', 'outfile')
  //.argument('[env]', 'Environment to deploy on', /^dev|staging|production$/, 'local')
  //.option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  .action(async function(args, options, logger) {

    let config = require('../backend/services/config.js')(args.config);

    // instanciate the services
    let services = {
      database: new Database(config.db),
      timestamps: new TimestampsContainer()
    };

    let project = args.project;
    let locale = args.locale;

    let translations = await services.database.query({
      project: project,
      locale: locale
    });

    if(args.outfile) {
      fs.writeFileSync(args.outfile, JSON.stringify(translations, null, 2));
    }
    else {
      console.log(JSON.stringify(translations, null, 2));
    }
  });
