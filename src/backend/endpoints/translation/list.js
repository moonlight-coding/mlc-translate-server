const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * List the translations
   */
  app.get('/translations', async function (req, res) {
    
    let list = await database.list();
    res.json(list);
  });
  
};

