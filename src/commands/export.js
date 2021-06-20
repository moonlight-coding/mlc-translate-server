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
  .option('--versions', 'exports all the versions, to maintain full history')
  .option('--commit-json', 'the json is formated in a way it is easily commitable in git')
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

    let params = {
      project: project,
      locale: locale
    };

    if(options.versions) {
      params.history = true;
    }

    let translations = await services.database.query(params);

    translations = translations.map((t) => {
      return {
        "locale": t['locale'],
        "project": t['project'],
        "group": t['group'],
        "key": t['key'],
        "value": t['value'],
        "creation_date": t['creation_date']
      };
    });

    let json = options.commitableJson ? toCommitableJson(translations) : JSON.stringify(translations);

    if(args.outfile) {
      fs.writeFileSync(args.outfile, json);
    }
    else {
      console.log(json);
    }
  });

function toCommitableJson(translations)
{
  let lines = translations.map((translation) => {
    return "  " + JSON.stringify(translation);
  }).join(",\n");

  return "[\n" + lines + "\n]";
}