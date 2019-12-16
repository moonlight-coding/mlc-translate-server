const axios = require('axios');
const rootUrl = "http://localhost:3001";

function URL(url) {
  return rootUrl + url;
};

async function list() {
  return axios.get(URL('/translations')).then((resp) => {
    return resp.data;
  });
}

async function create(locale, project, group, key, value) {
  return axios.post(URL('/translations'), {
    locale, project, group, key, value
  });
}

async function remove(id) {
  return axios.delete(URL('/translations/' + id));
}

async function query(params) {
  return axios.post(URL('/query'), params).then((resp) => {
    return resp.data;
  });
}

async function importTranslations(locale, project, translations) {
  return axios.post(URL('/import'), {
    locale, 
    project, 
    translations
  });
}

async function test() {
  await list();
  await create("en_GB", "admin", "users", "Users", "Users");
  await create("en_GB", "front", "front.users", "Users", "Users");
  await create("en_GB", "admin", "test", "Users", "Users");
  await list();
  await create("fr_FR", "admin", "users", "Users", "Utilisateurs");
  await list();
  await remove(1);
  await list();
  await create("en_GB", "admin", "users", "Users", "Usersss");
  await create("en_GB", "admin", "users", "Users", "User List");
  await list();
  
  await list();
  await importTranslations("en_GB", "admin", [
    {group: "users1", key: "key1", value: "value1"},
    {group: "users2", key: "key2", value: "value2"},
    {group: "users3", key: "key3", value: "value3"},
    {group: "users4", key: "key4", value: "value4"},
    {group: "users5", key: "key5", value: "value5"}
  ]);
  
  
  console.log("query projet 'admin' & history");
  let queryResult = await query({
    project: "admin",
    groups: null,
    history: true
  });
  console.log(queryResult);
  
  console.log("query project 'admin'");
  queryResult = await query({
    project: "admin"
  });
  console.log(queryResult);
  
  console.log("query project 'front'");
  queryResult = await query({
    project: "front"
  });
  console.log(queryResult);
  
  console.log("query all");
  try {
    queryResult = await query({});
  }
  catch(e) {
    console.log("Received an error:");
    console.log(e.response.data);
    console.log("We must specify the project, 'all' is not allowed");
  }
  
  console.log("query 2");
  queryResult = await query({
    project: "admin",
    groups: ["users"]
  });
  console.log(queryResult);
  
  console.log("query 3");
  queryResult = await query({
    project: "admin",
    groups: ["users"],
    history: true
  });
  console.log(queryResult);
}

test();