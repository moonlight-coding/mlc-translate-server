const axios = require('axios');
const rootUrl = "http://localhost:3001";

function URL(url) {
  return rootUrl + url;
};

async function list(parameters = null) {
  return axios.get(URL('/translations'), { params: parameters }).then((resp) => {
    return resp.data;
  });
}

async function get(id) {
  return axios.get(URL('/translations/' + id)).then((resp) => {
    return resp.data;
  });
}

function showResult(rows)
{
  for(let row of rows) {
    console.log(JSON.stringify(row));
  }
}

async function test() {
  
  console.log("============================");
  console.log("- list the distinct keys");
  let queryResult = await list({
    project: "admin"
  });
  showResult(queryResult);
  
  console.log("============================");
  console.log("- list the versions of a specific key");
  queryResult = await list({
    project: "admin",
    locale: "en_GB",
    group: "users",
    key: "Users",
    versions: "true"
  });
  showResult(queryResult);
  
  console.log("============================");
  console.log("- list the distinct keys with pagination");
  queryResult = await list({
    project: "admin",
    per_page: 2,
    page: 0
  });
  console.log(queryResult);
  
  console.log("- list the distinct keys with pagination");
  queryResult = await list({
    project: "admin",
    per_page: 2,
    page: 1
  });
  console.log(queryResult);
  
  console.log("============================");
  console.log("Fetch row 7");
  queryResult = await get(7);
  console.log(queryResult);
  //showResult(queryResult);
}

test();