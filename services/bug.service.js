const fs = require("fs");
var bugs = require("../data/bugs.json");
const PAGE_SIZE = 3;

const BASE_URL = "/api/bug/";

module.exports = {
  query,
  get,
  remove,
  save,
};

function query(filterBy) {
  //Filtering
  let filteredBugs = bugs;
  if (filterBy.title) {
    const regex = new RegExp(filterBy.title, "i");
    filteredBugs = filteredBugs.filter((bug) => regex.test(bug.title));
  }
  if (filterBy.minSeverity) {
    filteredBugs = filteredBugs.filter(
      (bug) => bug.severity >= filterBy.minSeverity
    );
  }
  if (filterBy.labels) {
    const regex = new RegExp(filterBy.labels, "i");
    filteredBugs = filteredBugs.filter((bug) => regex.test(bug.labels));
  }
  // if (filterBy.labels) {
  //   console.log(filterBy.labels);
  //   // const regex = new RegExp(filterBy.labels, "i");
  //   // filteredBugs = filteredBugs.filter((bug) => regex.test(bug.labels));
  // }
  //Sorting
  if (filterBy.sortBy === "createdAt") {
    filteredBugs = filteredBugs.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }  
  if (filterBy.sortBy === "severity") {
    console.log('severity');
    filteredBugs = filteredBugs.sort(function (a, b) {
      return b.severity - a.severity
    });

  }
  //Paging
  if (filterBy.pageIdx !== undefined) {
    const startIdx = filterBy.pageIdx * PAGE_SIZE;
    filteredBugs = filteredBugs.slice(startIdx, PAGE_SIZE + startIdx);
  }

  return Promise.resolve(filteredBugs);
}

function get(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId);
  if(!bug) return Promise.reject('Bug notfound')
  return Promise.resolve(bug);
}

function remove(bugId, loggedinUser) {
  const idx = bugs.findIndex((bug) => bug._id ===  bugId)
  if (idx === -1) return Promise.reject('no such bug')
  const bug = bugs[idx]
  if(bug.creator._id !== loggedinUser._id) return Promise.reject('not youtr bug')
  bugs.splice(idx, 1)
  return _writeBugsToFile();
}

function save(bug, loggedinUser) {
  if (bug._id) {
    const bugToUpdate = bugs.find((currBug) => currBug._id === bug._id);
    if (!bugToUpdate) return Promise.reject('No such Bug')
    if (bugToUpdate.creator._id !== loggedinUser._id) return Promise.reject('Not your bug')   
    
    bugToUpdate.title = bug.title;
    bugToUpdate.description = bug.description;
  } else {
    console.log("post");
    bug._id = _makeId();
    bug.creator = loggedinUser;
    bug.createdAt = Date.now();
    bug.severity = _getRandomIntInclusive(0, 2);
    bugs.push(bug);
  }
  return _writeBugsToFile().then(() => bug);
}

function _makeId(length = 5) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function _writeBugsToFile() {
  return new Promise((res, rej) => {
    const data = JSON.stringify(bugs, null, 2);
    fs.writeFile("data/bugs.json", data, (err) => {
      if (err) return rej(err);
      // console.log("File written successfully\n");
      res();
    });
  });
}

function _getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
