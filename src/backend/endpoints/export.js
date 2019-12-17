const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Query the system to fetch the desired data
   */
  app.post('/export', async function (req, res) {
    
    let body = req.body;
    
    let translations = await database.query({
      project: body.project,
      locale: body.locale
    });
    
    let missingTranslations = await database.listMissingTranslations(body.project, body.locale);
    
    res.json({
      translations,
      missing: missingTranslations
    });
  });
  
};

