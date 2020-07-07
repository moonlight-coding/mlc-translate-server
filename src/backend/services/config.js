const path = require('path');
const fs = require('fs');

module.exports = function loadConfig(configCmdName = null) {
  let configFilename = path.join(__dirname, '..', '..', '..', 'config.js');

  // the conf file is specified
  if(configCmdName) {
    configFilename = path.resolve(configCmdName);
  }

  // load the config
  if(!fs.existsSync(configFilename)) {
    if(configCmdName)
      console.error(`[!] ${configFilename} file doesn't exist..`);
    else
      console.error("[!] config.js must be created and completed. Use config.example.js to create it.");

    process.exit(1);
  }

  return require(configFilename);
};

