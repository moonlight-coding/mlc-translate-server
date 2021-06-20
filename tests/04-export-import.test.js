const spawnSync = require('child_process').spawnSync;
const path = require('path');
const fs = require('fs');
const u = require('./utils.js');

let confPath = path.join(__dirname, "..", "config.test.js");

function translateCmd(...args) {
  return spawnSync('node', [
    'index.js',
    ...args
  ], {
    cwd: path.dirname(confPath)
  });
}

//test('import the export with full history', async () => {
test('export before import', async () => {
  let ret = translateCmd("export", confPath, "en_GB", "import");
  let json = JSON.parse(ret.stdout.toString());

  expect(json).toEqual([
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key",
      "value": "value1",
      "creation_date": "2020-01-01 01:00"
    },
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key2",
      "value": "value2",
      "creation_date": "2020-01-01 02:00"
    }
  ]);
});

test('commit-json export', async () => {
  let ret = translateCmd("export", confPath, "en_GB", "import", "--commit-json");

  expect(ret.status).toBe(0);

  let json = ret.stdout.toString();
  json = json.replace(/"creation_date":"(.*?)"/g, '"creation_date":"DEFINED"');

  expect(json).toBe(`[
  {"locale":"en_GB","project":"import","group":"users","key":"key","value":"value1","creation_date":"DEFINED"},
  {"locale":"en_GB","project":"import","group":"users","key":"key2","value":"value2","creation_date":"DEFINED"}
]
`
  );

});

test('export with versions before import', async () => {
  let ret = translateCmd("export", confPath, "en_GB", "import", "--versions");
  let json = JSON.parse(ret.stdout.toString());

  expect(json).toEqual([
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key",
      "value": "value1",
      "creation_date": "2020-01-01 01:00"
    },
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key2",
      "value": "value2",
      "creation_date": "2020-01-01 02:00"
    }
  ]);
});

test('import', async () => {
  fs.writeFileSync('/tmp/translations.json', JSON.stringify([{
    "locale": "en_GB",
    "project": "import",
    "group": "users",
    "key": "key",
    "value": "value1",
    "creation_date": "2020-01-01 01:00"
  },
  {
    "locale": "en_GB",
    "project": "import",
    "group": "users",
    "key": "key2",
    "value": "value2",
    "creation_date": "2020-01-01 02:00"
  }]));

  let ret1 = translateCmd("import", confPath, "en_GB", "import", "/tmp/translations.json");
  expect(ret1.status).toBe(0);

  let ret = translateCmd("export", confPath, "en_GB", "import", "--versions");
  let json = JSON.parse(ret.stdout.toString());

  expect(json).toEqual([
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key",
      "value": "value1",
      "creation_date": "2020-01-01 01:00"
    },
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key2",
      "value": "value2",
      "creation_date": "2020-01-01 02:00"
    }
  ]);
});

test('import new version', async () => {
  fs.writeFileSync('/tmp/translations.json', JSON.stringify([{
    "locale": "en_GB",
    "project": "import",
    "group": "users",
    "key": "key",
    "value": "value1",
    "creation_date": "2021-01-01 01:00"
  }]));

  let ret = translateCmd("import", confPath, "en_GB", "import", "/tmp/translations.json");
  expect(ret.status).toBe(0);

  ret = translateCmd("export", confPath, "en_GB", "import");
  let json = JSON.parse(ret.stdout.toString());

  expect(json).toEqual([
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key",
      "value": "value1",
      "creation_date": "2021-01-01 01:00"
    },
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key2",
      "value": "value2",
      "creation_date": "2020-01-01 02:00"
    }
  ]);

  ret = translateCmd("export", confPath, "en_GB", "import", "--versions");
  json = JSON.parse(ret.stdout.toString());

  expect(json).toEqual([
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key",
      "value": "value1",
      "creation_date": "2020-01-01 01:00"
    },{
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key",
      "value": "value1",
      "creation_date": "2021-01-01 01:00"
    },
    {
      "locale": "en_GB",
      "project": "import",
      "group": "users",
      "key": "key2",
      "value": "value2",
      "creation_date": "2020-01-01 02:00"
    }
  ]);
});


