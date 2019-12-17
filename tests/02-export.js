const axios = require('axios');
const rootUrl = "http://localhost:3001";

function URL(url) {
  return rootUrl + url;
};

async function exportTranslations(project, locale) {
  return axios.post(URL('/export'), { project, locale }).then((resp) => {
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
  console.log("- export the jp translations");
  let queryResult = await exportTranslations("admin", "jp_JP");
  console.log(queryResult);
  
  console.log("============================");
  console.log("- export the fr translations");
  queryResult = await exportTranslations("admin", "fr_FR");
  console.log(queryResult);
  
}

test();