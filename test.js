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
  console.log("query projet 'admin' & history");
  let queryResult = await query({
    project: "admin",
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
  queryResult = await query({});
  console.log(queryResult);
  
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