const path = require('path');

module.exports = {
  url: 'http://localhost',
  port: 3001,
  db: path.join(__dirname, 'context', 'db.test.sqlite3')
};
