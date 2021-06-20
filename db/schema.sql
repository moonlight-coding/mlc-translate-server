CREATE TABLE translation(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  locale TEXT NOT NULL,
  project TEXT NOT NULL,
  'group' TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(locale, project, 'group', key, value, creation_date)
);
