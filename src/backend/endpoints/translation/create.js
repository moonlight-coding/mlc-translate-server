const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Create a translation
   */
  app.post('/translations', function (req, res) {
    
    let body = req.body;
    
    database.createTranslation(
      body.locale,
      body.project,
      body.group,
      body.key,
      body.value
    );
    
    res.json();
  });
  
};

