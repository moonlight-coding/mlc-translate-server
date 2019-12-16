const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * get a translations
   */
  app.get('/translations/:id', async function (req, res) {
    let id = req.params.id;
    
    let row = await database.getRow(id);
    
    res.json(row);
  });
  
};

