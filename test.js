const axios = require('axios');
const rootUrl = "http://localhost:3001";

function URL(url) {
  return rootUrl + url;
};

async function list() {
  return axios.get(URL('/translations')).then((resp) => {
    console.log(resp.status);
    console.log(resp.data);
    return resp;
  });
}

async function create(locale, project, group, key, value) {
  return axios.post(URL('/translations'), {
    locale, project, group, key, value
  }).then((resp) => {
    console.log(resp.status);
    console.log(resp.data);
    return resp;
  });
}

async function remove(id) {
  return axios.delete(URL('/translations/' + id));
}

async function test() {
  await list();
  await create("en_GB", "admin", "users", "Users", "Users");
  await list();
  await create("fr_FR", "admin", "users", "Users", "Utilisateurs");
  await list();
  await remove(1);
  await list();
}

test();