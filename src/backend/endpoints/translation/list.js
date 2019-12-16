const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * List the translations
   */
  app.get('/translations', async function (req, res) {
    
    /*
      project: "admin",
      group: "users",
      key: "Users",
      versions
    */
    
    let params = {
      project: null,
      locale: null, 
      group: null,
      key: null,
      history: false,
      per_page: null,
      page: null
    };
    
    if('project' in req.query)
      params['project'] = req.query['project'];
    
    if('locale' in req.query)
      params['locale'] = req.query['locale'];
    
    if('group' in req.query)
      params['group'] = req.query['group'];
    
    if('key' in req.query)
      params['key'] = req.query['key'];
    
    if('page' in req.query)
      params['page'] = parseInt(req.query['page']);
    
    if('per_page' in req.query)
      params['per_page'] = parseInt(req.query['per_page']);
    else if('page' in req.query)
      params.per_page = 20;
    
    if('versions' in req.query && req.query.versions === "true")
      params.history = true;
    
    let list = await database.query(params);
    
    if('page' in req.query) {
      
      res.json({
        items: list,
        total_items: (await database.queryCount(params))[0].total
      });
    }
    else {
      res.json(list);
    }
  });
  
};

