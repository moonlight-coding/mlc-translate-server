const path = require('path');

module.exports = (app, config, services) => {
  
  let db = services.databases;
  
  /**
   * Query the system to fetch the desired data
   */
  app.post('/query', function (req, res) {
    let groups = {};
    
    db.db.select("");
    
    res.json(groups);
  });
  
};

