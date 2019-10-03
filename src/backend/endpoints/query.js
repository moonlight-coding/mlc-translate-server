const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Query the system to fetch the desired data
   */
  app.post('/query', async function (req, res) {
    let groups = {};
    
    let history = req.body.history || false;
    
    if(history)
      req.body.history = false;
    
    // collect the keys normally, without history
    
    let rows = await database.query(req.body);
    
    rows.forEach((row) => {
      let group = row.group;
      let key = row.key;
      let value = row.value;
      
      if(!(group in groups))
        groups[group] = {};
      
      groups[group][key] = value;
    });
    
    let ret = {
      translations: groups
    };
    
    // collect the history
    if(history) {
      req.body.history = true;
      
      let groups = {};
      let rows = await database.query(req.body);
      
      rows.forEach((row) => {
        let group = row.group;
        let key = row.key;
        
        if(!(group in groups))
          groups[group] = {};
        
        if(!(key in groups[group]))
          groups[group][key] = [];
        
        groups[group][key].push({
          id: row.id,
          value: row.value
        });
      });
      
      ret.history = groups;
    }
    
    res.json(ret);
  });
  
};

