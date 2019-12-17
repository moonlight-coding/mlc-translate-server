const path = require('path');

module.exports = {
  port: 3000,
  host: 'localhost',
  db: path.join(__dirname, 'context', 'db.sqlite3')
};
