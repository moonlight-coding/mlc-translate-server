const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Create a translation
   */
  app.post('/translations', async function (req, res) {
    
    let body = req.body;
    
    let translation = await database.createTranslation(
      body.locale,
      body.project,
      body.group,
      body.key,
      body.value
    );
    
    // store the timestamp for the group
    services.timestamps.setGroupTimestamp(body.project, body.group, translation.creation_date);
    
    res.json();
  });
  
};

