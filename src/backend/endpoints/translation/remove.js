const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Remove a translation
   */
  app.delete('/translations/:id', function (req, res) {
    let id = req.params.id;
    
    database.removeTranslation(id);
    
    res.json();
  });
  
};

