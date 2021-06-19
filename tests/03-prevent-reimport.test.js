let u = require('./utils.js');

test('creation and import', async () => {

  expect(await u.listWithoutCreationDate({
    project: "import",
    locale: "en_GB",
    group: "users",
    versions: "true"
  })).toEqual([]);

  await u.importTranslations("en_GB", "import", [
    {group: "users", key: "key", value: "value1", creation_date: '2020-01-01 01:00'}
  ]);

  expect(await u.listWithoutCreationDate({
    project: "import",
    locale: "en_GB",
    group: "users",
    versions: "true"
  })).toEqual([
    {
      id: 16,
      locale: 'en_GB',
      project: 'import',
      group: 'users',
      key: 'key',
      value: 'value1',
      creation_date: 'DEFINED'
    }
  ]);

  await u.importTranslations("en_GB", "import", [
    {group: "users", key: "key", value: "value1", creation_date: '2020-01-01 01:00'},
    {group: "users", key: "key2", value: "value2", creation_date: '2020-01-01 02:00'}
  ]);

  expect(await u.listWithoutCreationDate({
    project: "import",
    locale: "en_GB",
    group: "users",
    versions: "true"
  })).toEqual([
    {
      id: 16,
      locale: 'en_GB',
      project: 'import',
      group: 'users',
      key: 'key',
      value: 'value1',
      creation_date: 'DEFINED'
    },
    {
      id: 18,
      locale: 'en_GB',
      project: 'import',
      group: 'users',
      key: 'key2',
      value: 'value2',
      creation_date: 'DEFINED'
    }
  ]);
});
