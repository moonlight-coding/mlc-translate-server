let u = require('./utils.js');

describe('query', () => {
  test("list the distinct keys", async () => {
    let queryResult = await u.listWithoutCreationDate({
      project: "admin"
    });
    
    expect(queryResult).toEqual([
      {
        "id": 7,
        "locale": "en_GB",
        "project": "admin",
        "group": "test",
        "key": "Users",
        "value": "Users",
        "creation_date": "DEFINED"
      },
      {
        "id": 10,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "User List",
        "creation_date": "DEFINED"
      },
      {
        "id": 11,
        "locale": "en_GB",
        "project": "admin",
        "group": "users1",
        "key": "key1",
        "value": "value1",
        "creation_date": "DEFINED"
      },
      {
        "id": 12,
        "locale": "en_GB",
        "project": "admin",
        "group": "users2",
        "key": "key2",
        "value": "value2",
        "creation_date": "DEFINED"
      },
      {
        "id": 13,
        "locale": "en_GB",
        "project": "admin",
        "group": "users3",
        "key": "key3",
        "value": "value3",
        "creation_date": "DEFINED"
      },
      {
        "id": 14,
        "locale": "en_GB",
        "project": "admin",
        "group": "users4",
        "key": "key4",
        "value": "value4",
        "creation_date": "DEFINED"
      },
      {
        "id": 15,
        "locale": "en_GB",
        "project": "admin",
        "group": "users5",
        "key": "key5",
        "value": "value5",
        "creation_date": "DEFINED"
      }
    ]);
  });

  test("list the versions of a specific key", async () => {

    let queryResult = await u.listWithoutCreationDate({
      project: "admin",
      locale: "en_GB",
      group: "users",
      key: "Users",
      versions: "true"
    });

    expect(queryResult).toEqual([
      {
        "id": 1,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "Users",
        "creation_date": "DEFINED"
      },
      {
        "id": 2,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "Users2",
        "creation_date": "DEFINED"
      },
      {
        "id": 3,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "Users3",
        "creation_date": "DEFINED"
      },
      {
        "id": 4,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "Users4",
        "creation_date": "DEFINED"
      },
      {
        "id": 5,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "Users5",
        "creation_date": "DEFINED"
      },
      {
        "id": 9,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "Usersss",
        "creation_date": "DEFINED"
      },
      {
        "id": 10,
        "locale": "en_GB",
        "project": "admin",
        "group": "users",
        "key": "Users",
        "value": "User List",
        "creation_date": "DEFINED"
      }
    ]);
  });

  test("list the distinct keys with pagination", async () => {
    let queryResult = await u.listWithoutCreationDate({
      project: "admin",
      per_page: 2,
      page: 0
    });

    expect(queryResult).toEqual({
      "items": [
        {
          "id": 7,
          "locale": "en_GB",
          "project": "admin",
          "group": "test",
          "key": "Users",
          "value": "Users",
          "creation_date": "DEFINED"
        },
        {
          "id": 10,
          "locale": "en_GB",
          "project": "admin",
          "group": "users",
          "key": "Users",
          "value": "User List",
          "creation_date": "DEFINED"
        }
      ],
      "total_items": 7
    });
  });
  
  test("list the distinct keys with pagination", async () => {
    let queryResult = await u.listWithoutCreationDate({
      project: "admin",
      per_page: 2,
      page: 1
    });

    expect(queryResult).toEqual({
      "items": [
        {
          "id": 11,
          "locale": "en_GB",
          "project": "admin",
          "group": "users1",
          "key": "key1",
          "value": "value1",
          "creation_date": "DEFINED"
        },
        {
          "id": 12,
          "locale": "en_GB",
          "project": "admin",
          "group": "users2",
          "key": "key2",
          "value": "value2",
          "creation_date": "DEFINED"
        }
      ],
      "total_items": 7
    });
  });

  test("Fetch row 7", async () => {
    let queryResult = await u.get(7);

    queryResult.creation_date = u.convertDateForTest(queryResult);

    expect(queryResult).toEqual({
      "id": 7,
      "locale": "en_GB",
      "project": "admin",
      "group": "test",
      "key": "Users",
      "value": "Users",
      "creation_date": "DEFINED"
    });
  });
});
