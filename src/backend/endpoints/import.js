const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Query the system to fetch the desired data
   */
  app.post('/import', async function (req, res) {
    
    let body = req.body;
    
    let lastTranslation = await database.createTranslations(
      body.locale,
      body.project,
      body.translations
    );
    
    let groups = [];
    
    for(let translation of body.translations) {
      let group = translation.group;
      
      if(groups.indexOf(group) == -1) {
        groups.push(group);
      }
    }
    
    // store the timestamp for the groups
    for(let group of groups) {
      services.timestamps.setGroupTimestamp(body.project, group, lastTranslation.creation_date);
    }
    
    res.json();
  });
  
};

