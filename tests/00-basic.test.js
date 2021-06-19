let u = require('./utils.js');

test('creation and import', async () => {

  expect(await u.list()).toEqual([]);
  

  await u.create("en_GB", "admin", "users", "Users", "Users");
  await u.create("en_GB", "admin", "users", "Users", "Users2");
  await u.create("en_GB", "admin", "users", "Users", "Users3");
  await u.create("en_GB", "admin", "users", "Users", "Users4");
  await u.create("en_GB", "admin", "users", "Users", "Users5");
  await u.create("en_GB", "front", "front.users", "Users", "Users");
  await u.create("en_GB", "admin", "test", "Users", "Users");
  
  expect(await u.listWithoutCreationDate()).toEqual([
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
      "id": 5,
      "locale": "en_GB",
      "project": "admin",
      "group": "users",
      "key": "Users",
      "value": "Users5",
      "creation_date": "DEFINED"
    },
    {
      "id": 6,
      "locale": "en_GB",
      "project": "front",
      "group": "front.users",
      "key": "Users",
      "value": "Users",
      "creation_date": "DEFINED"
    }
  ]);

  // expect(sum(1, 2)).toBe(3);
  
  await u.create("fr_FR", "admin", "users", "Users", "Utilisateurs");
  
  expect(await u.listWithoutCreationDate()).toEqual([
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
      "id": 5,
      "locale": "en_GB",
      "project": "admin",
      "group": "users",
      "key": "Users",
      "value": "Users5",
      "creation_date": "DEFINED"
    },
    {
      "id": 8,
      "locale": "fr_FR",
      "project": "admin",
      "group": "users",
      "key": "Users",
      "value": "Utilisateurs",
      "creation_date": "DEFINED"
    },
    {
      "id": 6,
      "locale": "en_GB",
      "project": "front",
      "group": "front.users",
      "key": "Users",
      "value": "Users",
      "creation_date": "DEFINED"
    }
  ]);

  await u.remove(8);
  
  expect(await u.listWithoutCreationDate()).toEqual([
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
      "id": 5,
      "locale": "en_GB",
      "project": "admin",
      "group": "users",
      "key": "Users",
      "value": "Users5",
      "creation_date": "DEFINED"
    },
    {
      "id": 6,
      "locale": "en_GB",
      "project": "front",
      "group": "front.users",
      "key": "Users",
      "value": "Users",
      "creation_date": "DEFINED"
    }
  ]);

  await u.create("en_GB", "admin", "users", "Users", "Usersss");
  await u.create("en_GB", "admin", "users", "Users", "User List");
  
  expect(await u.listWithoutCreationDate()).toEqual([
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
      "id": 6,
      "locale": "en_GB",
      "project": "front",
      "group": "front.users",
      "key": "Users",
      "value": "Users",
      "creation_date": "DEFINED"
    }
  ]);

  await u.importTranslations("en_GB", "admin", [
    {group: "users1", key: "key1", value: "value1"},
    {group: "users2", key: "key2", value: "value2"},
    {group: "users3", key: "key3", value: "value3"},
    {group: "users4", key: "key4", value: "value4"},
    {group: "users5", key: "key5", value: "value5"}
  ]);

  expect(await u.listWithoutCreationDate()).toEqual([
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
    },
    {
      "id": 6,
      "locale": "en_GB",
      "project": "front",
      "group": "front.users",
      "key": "Users",
      "value": "Users",
      "creation_date": "DEFINED"
    }
  ]);
});

describe('query', () => {
  test("query projet 'admin' & history'", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "admin",
      groups: null,
      history: true
    });

    expect(queryResult).toEqual({
      "translations": {
        "test": {
          "Users": "Users"
        },
        "users": {
          "Users": "User List"
        },
        "users1": {
          "key1": "value1"
        },
        "users2": {
          "key2": "value2"
        },
        "users3": {
          "key3": "value3"
        },
        "users4": {
          "key4": "value4"
        },
        "users5": {
          "key5": "value5"
        }
      },
      "timestamps": {
        "test": "DEFINED",
        "users": "DEFINED",
        "users1": "DEFINED",
        "users2": "DEFINED",
        "users3": "DEFINED",
        "users4": "DEFINED",
        "users5": "DEFINED"
      },
      "history": {
        "users": {
          "Users": [
            {
              "id": 1,
              "value": "Users"
            },
            {
              "id": 2,
              "value": "Users2"
            },
            {
              "id": 3,
              "value": "Users3"
            },
            {
              "id": 4,
              "value": "Users4"
            },
            {
              "id": 5,
              "value": "Users5"
            },
            {
              "id": 9,
              "value": "Usersss"
            },
            {
              "id": 10,
              "value": "User List"
            }
          ]
        },
        "test": {
          "Users": [
            {
              "id": 7,
              "value": "Users"
            }
          ]
        },
        "users1": {
          "key1": [
            {
              "id": 11,
              "value": "value1"
            }
          ]
        },
        "users2": {
          "key2": [
            {
              "id": 12,
              "value": "value2"
            }
          ]
        },
        "users3": {
          "key3": [
            {
              "id": 13,
              "value": "value3"
            }
          ]
        },
        "users4": {
          "key4": [
            {
              "id": 14,
              "value": "value4"
            }
          ]
        },
        "users5": {
          "key5": [
            {
              "id": 15,
              "value": "value5"
            }
          ]
        }
      }
    });
  });
  

  test("query project 'admin'", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "admin"
    });

    expect(queryResult).toEqual({
      "translations": {
        "test": {
          "Users": "Users"
        },
        "users": {
          "Users": "User List"
        },
        "users1": {
          "key1": "value1"
        },
        "users2": {
          "key2": "value2"
        },
        "users3": {
          "key3": "value3"
        },
        "users4": {
          "key4": "value4"
        },
        "users5": {
          "key5": "value5"
        }
      },
      "timestamps": {
        "test": "DEFINED",
        "users": "DEFINED",
        "users1": "DEFINED",
        "users2": "DEFINED",
        "users3": "DEFINED",
        "users4": "DEFINED",
        "users5": "DEFINED"
      }
    });
  });

  test("query project 'front'", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "front"
    });

    expect(queryResult).toEqual({
      "translations": {
        "front.users": {
          "Users": "Users"
        }
      },
      "timestamps": {
        "front.users": "DEFINED"
      }
    });
  });

  test("query all", async () => {
    // We must specify the project, 'all' is not allowed, an exception should be fired
    let errored = false;
    try {
      queryResult = await u.query({});
    }
    catch(e) {
      errored = true;

      expect(e.response.data).toEqual({"error": "'project' body attribute MUST be provided"});
    }

    expect(errored).toBe(true);
  });


  test("query admin 'users' group for FR", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "admin",
      locale: "fr_FR",
      groups: ["users"]
    });
    expect(queryResult).toEqual({
      "translations": {},
      "timestamps": {}
    });
  });
  
  test("query admin 'users' group for en_GB", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "admin",
      locale: "en_GB",
      groups: ["users"]
    });
    expect(queryResult).toEqual({
      "translations": {
        "users": {
          "Users": "User List"
        }
      },
      "timestamps": {
        "users": "DEFINED"
      }
    });
  });
  
  test("query admin `users` group with history for FR", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "admin",
      locale: "fr_FR",
      groups: ["users"],
      history: true
    });
    expect(queryResult).toEqual({
      "translations": {},
      "timestamps": {},
      "history": {}
    });
  });

  test("query admin `users` group with history for en_GB", async () => {
    let queryResult = await u.queryWithoutTimestamps({
      project: "admin",
      locale: "en_GB",
      groups: ["users"],
      history: true
    });
    expect(queryResult).toEqual({
      "translations": {
        "users": {
          "Users": "User List"
        }
      },
      "timestamps": {
        "users": "DEFINED"
      },
      "history": {
        "users": {
          "Users": [
            {
              "id": 1,
              "value": "Users"
            },
            {
              "id": 2,
              "value": "Users2"
            },
            {
              "id": 3,
              "value": "Users3"
            },
            {
              "id": 4,
              "value": "Users4"
            },
            {
              "id": 5,
              "value": "Users5"
            },
            {
              "id": 9,
              "value": "Usersss"
            },
            {
              "id": 10,
              "value": "User List"
            }
          ]
        }
      }
    });
  });

});
  
  
  
  
  
  
  
  
