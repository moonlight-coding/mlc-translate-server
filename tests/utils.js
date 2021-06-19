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

function convertDateForTest(date) {
  return date ? 'DEFINED' : null;
}

async function listWithoutCreationDate(parameters = null) {
  let ret = await list(parameters);

  let array = ret;

  if(parameters && 'page' in parameters && parameters.page !== null) {
    array = ret.items;
  }

  for(let obj of array) {
    obj.creation_date = convertDateForTest(obj.creation_date);
  }

  return ret;
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

async function queryWithoutTimestamps(params) {
  let ret = await query(params);

  for(let key in ret.timestamps) {
    ret.timestamps[key] = convertDateForTest(ret.timestamps[key]);
  }

  return ret;
}

async function importTranslations(locale, project, translations) {
  return axios.post(URL('/import'), {
    locale, 
    project, 
    translations
  });
}

async function get(id) {
  return axios.get(URL('/translations/' + id)).then((resp) => {
    return resp.data;
  });
}

async function exportTranslations(project, locale) {
  return axios.post(URL('/export'), { project, locale }).then((resp) => {
    return resp.data;
  });
}


module.exports = {
  URL,
  list,
  listWithoutCreationDate,
  create,
  remove,
  query,
  get,
  queryWithoutTimestamps,
  importTranslations,
  convertDateForTest,
  exportTranslations
};
