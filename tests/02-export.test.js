
let u = require('./utils.js');

describe('query', () => {
  test("export the jp translations", async () => {
    let queryResult = await u.exportTranslations("admin", "jp_JP");
    
    expect(queryResult).toEqual({
      translations: [],
      missing: [
        { group: 'test', key: 'Users' },
        { group: 'users', key: 'Users' },
        { group: 'users1', key: 'key1' },
        { group: 'users2', key: 'key2' },
        { group: 'users3', key: 'key3' },
        { group: 'users4', key: 'key4' },
        { group: 'users5', key: 'key5' }
      ]
    });
  });

  test("export the fr translations", async () => {
    let queryResult = await u.exportTranslations("admin", "en_GB");
    
    for(let t of queryResult.translations) {
      t.creation_date = u.convertDateForTest(t.creation_date);
    }

    expect(queryResult).toEqual({
      translations: [
        {
          id: 7,
          locale: 'en_GB',
          project: 'admin',
          group: 'test',
          key: 'Users',
          value: 'Users',
          creation_date: 'DEFINED'
        },
        {
          id: 10,
          locale: 'en_GB',
          project: 'admin',
          group: 'users',
          key: 'Users',
          value: 'User List',
          creation_date: 'DEFINED'
        },
        {
          id: 11,
          locale: 'en_GB',
          project: 'admin',
          group: 'users1',
          key: 'key1',
          value: 'value1',
          creation_date: 'DEFINED'
        },
        {
          id: 12,
          locale: 'en_GB',
          project: 'admin',
          group: 'users2',
          key: 'key2',
          value: 'value2',
          creation_date: 'DEFINED'
        },
        {
          id: 13,
          locale: 'en_GB',
          project: 'admin',
          group: 'users3',
          key: 'key3',
          value: 'value3',
          creation_date: 'DEFINED'
        },
        {
          id: 14,
          locale: 'en_GB',
          project: 'admin',
          group: 'users4',
          key: 'key4',
          value: 'value4',
          creation_date: 'DEFINED'
        },
        {
          id: 15,
          locale: 'en_GB',
          project: 'admin',
          group: 'users5',
          key: 'key5',
          value: 'value5',
          creation_date: 'DEFINED'
        }
      ],
      missing: []
    });
  });
});


