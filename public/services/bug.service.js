const axios = require("axios");

const BASE_URL = "/api/bug/";

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getEmptyBug,
};

function query(filterBy = getDefaultFilter(), sortBy) {
  const queryParams = `?title=${filterBy.title}&severity=${filterBy.minSeverity}&labels=${filterBy.labels}&pageIdx=${filterBy.pageIdx}&sortBy=${sortBy} `
  return axios.get(BASE_URL + queryParams).then((res) => res.data);
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data);
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data);
}

function save(bug) {
  const url = bug._id ? BASE_URL + `${bug._id}` : BASE_URL;
  const method = bug._id ? "put" : "post";
  return axios[method](url, bug).then((res) => res.data);
}

function getEmptyBug(title = "", severity = "") {
  return { title, severity };
}

function getDefaultFilter() {
  return { title: "", minSeverity: "", pageIdx: 0, labels: [] };
}
