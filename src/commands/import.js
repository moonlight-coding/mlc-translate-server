const fs = require('fs');
const Database = require('../backend/services/database.js');
const TimestampsContainer = require('../backend/services/timestamps-container.js');

const prog = require('caporal');

prog
  .version('1.0.0')
  .command('import', 'Import')
  .argument('<config>', 'the config.js file to use')
  .argument('<locale>', 'the locale')
  .argument('<project>', 'the project')
  .argument('<translations>', 'the file which contains the translations')
  //.argument('<app>', 'App to deploy', /^myapp|their-app$/)
  //.argument('[env]', 'Environment to deploy on', /^dev|staging|production$/, 'local')
  //.option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  .action(async function(args, options, logger) {

    let config = require('../backend/services/config.js')(args.config);

    // instanciate the services
    let services = {
      database: new Database(config.db),
      timestamps: new TimestampsContainer()
    };

    let locale = args.locale;
    let project = args.project;
    let translationsFile = args.translations;

    if(!fs.existsSync(translationsFile)) {
      console.log("[!] translation file not found");
      process.exit(1);
    }

    let translations = JSON.parse(fs.readFileSync(translationsFile, 'utf-8'));

    // --

    let lastTranslation = await services.database.createTranslations(
      locale,
      project,
      translations
    );

    if(lastTranslation == null)
      return;

    let groups = [];

    for(let translation of translations) {
      let group = translation.group;

      if(groups.indexOf(group) == -1) {
        groups.push(group);
      }
    }

    // store the timestamp for the groups
    for(let group of groups) {
      services.timestamps.setGroupTimestamp(project, group, lastTranslation.creation_date);
    }
  });
