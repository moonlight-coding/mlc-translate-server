const path = require('path');

module.exports = (app, config, services) => {
  
  let database = services.database;
  
  /**
   * Query the system to fetch the desired data
   */
  app.post('/query', async function (req, res) {
    let groups = {};
    let timestamps = {};
    
    let queryBody = req.body;
    
    if(queryBody.project == null) {
      res.status(400).json({
        error: "'project' body attribute MUST be provided"
      });
      return;
    }
    
    // load the project Timestamps
    let projectTimestamps = services.timestamps.getProject(queryBody.project);
    
    let history = queryBody.history || false;
    
    if(history)
      queryBody.history = false;
    
    // prepare the query `groups` field
    let queryGroups = queryBody.groups;
    let initialGroups = queryGroups;
    
    if(queryBody.groups === null) {
      // nothing to do, fetch all the groups
    }
    else if(queryBody.groups.length > 0 && !Array.isArray(queryBody.groups[0])) {
      // nothing to do, we are asked the groups without timestamps
    }
    else if(queryBody.groups.length > 0 && Array.isArray(queryBody.groups[0])) {
      // we are given the groups with their timestamps
      // so we only load the groups that are expired 
      queryGroups = [];
      initialGroups = [];
      for(let g of queryBody.groups) {
        let groupName = g[0];
        let timestamp = g[1];
        
        initialGroups.push(groupName);
        
        // is the timestamp expired ?
        if(timestamp == null || !(groupName in projectTimestamps) || timestamp < projectTimestamps[groupName]) {
          queryGroups.push(groupName);
        }
      }
    }
    
    queryBody.groups = queryGroups;
    
    // collect the keys normally, without history
    
    let rows = await database.query(queryBody);
    
    rows.forEach((row) => {
      let group = row.group;
      let key = row.key;
      let value = row.value;
      let creation_date = row.creation_date;
      
      if(!(group in groups))
        groups[group] = {};
      
      groups[group][key] = value;
      
      if(!(group in timestamps) || timestamps[group] < creation_date) {
        timestamps[group] = creation_date;
        services.timestamps.setGroupTimestamp(queryBody.project, group, creation_date);
      }
    });
    
    let ret = {
      translations: groups,
      timestamps: timestamps
    };
    
    // collect the history
    if(history) {
      queryBody.history = true;
      queryBody.groups = initialGroups;
      
      let groups = {};
      let rows = await database.query(queryBody);
      
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

