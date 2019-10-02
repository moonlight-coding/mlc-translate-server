const path = require('path');

module.exports = {
  url: 'http://localhost',
  port: 3000,
  db: path.join(__dirname, 'context', 'db.sqlite3')
};
