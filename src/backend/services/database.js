const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database
{
  constructor(filename) {
    // check if the db was initialized
    let initialized = (filename != ':memory:') && fs.existsSync(filename);
    
    // instanciate the db, the file is created if it doesn't exist
    this.db = new sqlite3.Database(filename);
    
    
    if(!initialized)
      this.initialize();
  }
  
  initialize() {
    let filename = path.join(__dirname, '..', '..', '..', 'db', 'schema.sql');
    let schema = fs.readFileSync(filename, 'utf-8');
    
    this.db.serialize(() => {
      this.db.run(schema);
    });
  }
  
  close() {
    this.db.close();
  }
  
  createTranslation(locale, project, group, key, value) {
    this.db.serialize(() => {
      let stmt = this.db.prepare("INSERT INTO translation(locale, project, 'group', key, value) VALUES (?, ?, ?, ?, ?)");
      
      stmt.run(locale, project, group, key, value);
      
      stmt.finalize();
    });
  }
  
  removeTranslation(id) {
    this.db.serialize(() => {
      let stmt = this.db.prepare("DELETE FROM translation WHERE id = ?");
      
      stmt.run(id);
      
      stmt.finalize();
    });
  }
  
  async list() {
    
    console.log("start");
    
    let rows = await this.all("SELECT * FROM translation;");
    
    console.log("finished..");
    //console.log(rows);
    return rows;
  }
  
  async all(query) {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        resolve(rows);
      })
    });
  }
}

module.exports = Database;