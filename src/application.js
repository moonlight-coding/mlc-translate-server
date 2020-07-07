const prog = require('caporal');

require("./commands/server.js");
require("./commands/export.js");
require("./commands/import.js");
require("./commands/list.js");

prog.parse(process.argv);
