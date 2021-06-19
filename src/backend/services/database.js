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

  async getRow(id) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM translation WHERE id = ?`;

      let stmt = this.db.prepare(sql);

      stmt.all(id, (err, rows) => {
        if(rows.length > 0)
          resolve(rows[0]);
        else {
          reject(err);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      let stmt = this.db.prepare(sql);

      stmt.all(...params, (err, rows) => {
        resolve(rows);
      });
    });
  }

  async createTranslation(locale, project, group, key, value) {
    //this.db.serialize(() => {
    let promise = new Promise((resolve) => {

      let stmt = this.db.prepare("INSERT INTO translation(locale, project, 'group', key, value) VALUES (?, ?, ?, ?, ?)");

      stmt.run(locale, project, group, key, value, resolve);

      stmt.finalize();
    });

    return promise.then(() => {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM translation WHERE locale = ? AND project = ? AND \`group\` = ? AND key = ? ORDER BY id DESC LIMIT 1`;

        let stmt = this.db.prepare(sql);

        stmt.all(locale, project, group, key, (err, rows) => {
          if(rows.length > 0)
            resolve(rows[0]);
          else {
            reject(err);
          }
        });
      });
    });
    //});
  }

  async createTranslations(locale, project, translations) {
    let promise = new Promise((resolve) => {

      let valuesSql = translations.map((translation) => {
        if('creation_date' in translation && translation.creation_date != null) {
          return "(?, ?, ?, ?, ?, ?)";
        }

        return "(?, ?, ?, ?, ?, datetime('now'))";
      });

      let valuesStr = valuesSql.join(", ");

      let stmt = this.db.prepare(`
        INSERT 
        OR IGNORE
        INTO translation(locale, project, 'group', key, value, creation_date) 
          VALUES ${valuesStr} 
        
      `);

      let args = [];

      translations.forEach((translation) => {
        args.push(locale);
        args.push(project);
        args.push(translation.group);
        args.push(translation.key);
        args.push(translation.value);
        
        if('creation_date' in translation && translation.creation_date != null) {
          args.push(translation.creation_date);
        }
      });

      args.push(resolve);
      stmt.run(...args);

      stmt.finalize();
    });

    return promise.then(() => {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM translation WHERE locale = ? AND project = ? ORDER BY id DESC LIMIT 1`;

        let stmt = this.db.prepare(sql);

        stmt.all(locale, project, (err, rows) => {
          if(rows.length > 0)
            resolve(rows[0]);
          else {
            reject(err);
          }
        });
      });
    });
  }

  removeTranslation(id) {
    this.db.serialize(() => {
      let stmt = this.db.prepare("DELETE FROM translation WHERE id = ?");

      stmt.run(id);

      stmt.finalize();
    });
  }

  async queryCount(params) {
    let countParams = params;
    countParams.per_page = null;
    countParams.page = null;
    return this.query(countParams, true);
  }

  async query(params, returnCount = false) {

    if(params.groups != null && params.groups.length > 0) {
      return this.queryGroups(params, returnCount);
    }

    let queryParams = [];
    let condition = "TRUE";

    if(params.project != null) {
      condition = "project = ?";
      queryParams.push(params.project);
    }
    if(params.locale != null) {
      condition += " AND locale = ?";
      queryParams.push(params.locale);
    }
    if(params.group != null) {
      condition += " AND `group` = ?";
      queryParams.push(params.group);
    }
    if(params.key != null) {
      condition += " AND key = ?";
      queryParams.push(params.key);
    }

    let returnSql = returnCount ? 'COUNT(id) as total' : '*';
    let limitSql = params.per_page ? `LIMIT ${params.per_page} OFFSET ${params.page * params.per_page}` : "";
    let sql = `SELECT ${returnSql} FROM translation WHERE ${condition} ORDER BY project ASC, locale ASC, \`group\` ASC, key ASC, id ASC ${limitSql}`;

    if(params.history !== true) {
      sql = `
SELECT ${returnSql} 
FROM translation 
WHERE 
  id IN (
    SELECT MAX(id) 
    FROM translation 
    WHERE ${condition} 
    GROUP BY locale, project, \`group\`, key
  ) 
ORDER BY project ASC, locale ASC, \`group\` ASC, key ASC, id ASC ${limitSql}
      `;
    }

    let stmt = this.db.prepare(sql);

    return new Promise((resolve) => {
      let endCallback = (err, rows) => {
        resolve(rows);
      };

      queryParams.push(endCallback);

      stmt.all.apply(stmt, queryParams);

      stmt.finalize();
    });
  }

  async queryGroups(params, returnCount = false) {
    let returnSql = returnCount ? 'COUNT(id) as total' : '*';
    let limitSql = params.per_page ? `LIMIT ${params.per_page} OFFSET ${params.page * params.per_page}` : "";
    let queryParams = [];

    let condition = "TRUE";

    if(params.project != null) {
      condition = "project = ?";
      queryParams.push(params.project);
    }
    if(params.locale != null) {
      condition += " AND locale = ?";
      queryParams.push(params.locale);
    }

    queryParams = queryParams.concat(params.groups);

    condition += " AND `group` IN (" + params.groups.map(g => '?').join(',') + ")";

    let sql = `SELECT ${returnSql} FROM translation WHERE ${condition} ORDER BY id ASC ${limitSql}`;

    if(params.history !== true) {
      sql = `SELECT ${returnSql} FROM translation WHERE id IN (SELECT MAX(id) FROM translation WHERE ${condition} GROUP BY locale, project, \`group\`, key) ORDER BY id ASC ${limitSql}`;
    }

    let stmt = this.db.prepare(sql);

    return new Promise((resolve) => {
      let endCallback = (err, rows) => {
        resolve(rows);
      };

      queryParams.push(endCallback);

      stmt.all.apply(stmt, queryParams);

      stmt.finalize();
    });
  }

  async all(query, parameters) {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        resolve(rows);
      })
    });
  }

  async listMissingTranslations(project, locale) {
    let sql = `SELECT t.\`group\`, key from translation as t WHERE project = ? AND (t.\`group\`, key) NOT IN (
      SELECT t2.\`group\`, t2.key FROM translation as t2 WHERE t2.project = ? AND t2.locale = ?
    ) GROUP BY t.\`group\`, key ORDER BY t.\`group\` asc, t.key asc`;
    let queryParams = [project, project, locale];

    let stmt = this.db.prepare(sql);

    return new Promise((resolve) => {
      let endCallback = (err, rows) => {
        resolve(rows);
      };

      queryParams.push(endCallback);

      stmt.all.apply(stmt, queryParams);

      stmt.finalize();
    });
  }
}

module.exports = Database;