class TimestampsContainer
{
  constructor() {
    this.projects = {};
  }
  
  setGroupTimestamp(project, group, timestamp) {
    if(!(project in this.projects))
      this.projects[project] = {};
    
    this.projects[project][group] = timestamp;
  }
  
  getProject(project) {
    if(project in this.projects)
      return this.projects[project];
    
    return {};
  }
}

module.exports = TimestampsContainer;
