import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { BugList } from "../cmps/bug-list.jsx";
import { BugFilter } from "../cmps/bug-filter-cmp.jsx";

const { useState, useEffect } = React;

export function BugIndex() {
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter());
  const [sortBy, setSortBy] = useState("createdAt")
  const [bugs, setBugs] = useState([]);


  useEffect(() => {
    loadBugs();
  }, [filterBy, sortBy]);


  function loadBugs() {
    bugService.query(filterBy, sortBy).then(setBugs);
  }

  function onSetFilter(filterBy) {
    setFilterBy(filterBy);
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId);
        setBugs(bugsToUpdate);
        showSuccessMsg("Bug removed");
      })
      .catch((err) => {
        showErrorMsg("Cannot remove bug");
      });
  }

  function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      description: prompt("Bug Description?"),
    };
    bugService.save(bug)
      .then((savedBug) => {
        console.log("Added Bug", savedBug);
        setBugs([...bugs, savedBug]);
        showSuccessMsg("Bug added");
      })
      .catch((err) => {
        console.log("Error from onAddBug ->", err);
        showErrorMsg("Cannot add bug");
      });
  }

// for testing purposes

  function onEditBug(bug) {
    const severity = +prompt("New severity?");
    // const description = propmt("New Description");
    const bugToSave = { ...bug, severity };
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        console.log("Updated Bug:", savedBug);
        const bugsToUpdate = bugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        );
        setBugs(bugsToUpdate);
        showSuccessMsg("Bug updated");
      })
      .catch((err) => {
        console.log("Error from onEditBug ->", err);
        showErrorMsg("Cannot update bug");
      });
  }

function filterByTag(value) {
  console.log(value);
}

  function sortByDate() {
    let sort = "createdAt"
    setSortBy(sort)
    loadBugs()
    console.log('we made it');
  }

  function sortBySeverity() {
    let sort = "severity"
    setSortBy(sort)
    loadBugs()
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugFilter onSetFilter={onSetFilter} sortByDate={sortByDate} sortBySeverity={sortBySeverity} filterByTag={filterByTag} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />

      </main>
    </main>
  );
}
