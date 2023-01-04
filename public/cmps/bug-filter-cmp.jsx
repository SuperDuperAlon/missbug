const { useState, useEffect, useRef } = React;

import { bugService } from "../services/bug.service.js";

export function BugFilter({ onSetFilter, sortByDate , sortBySeverity, filterByTag}) {
  const [filterByToEdit, setFilterByToEdit] = useState(
    bugService.getDefaultFilter()
  );
  const elInputRef = useRef(null);

  useEffect(() => {
    elInputRef.current.focus();
  }, []);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange({ target }) {
    let { value, name: field, type } = target;
    console.log(value);
    value = type === "number" ? +value : value;
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  function onSubmitFilter(ev) {
    // update father cmp that filters change on submit
    ev.preventDefault();
    onSetFilter(filterByToEdit);
  }

  return (
    <section>
      <h2>Filter our Bugs</h2>
      <form onSubmit={onSubmitFilter}>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="By title"
          value={filterByToEdit.title}
          onChange={handleChange}
          ref={elInputRef}
        />

        <label htmlFor="minSeverity">minSeverity:</label>
        <input
          type="number"
          id="minSeverity"
          name="minSeverity"
          placeholder="By min severity"
          value={filterByToEdit.minSeverity}
          onChange={handleChange}
        />

        <label htmlFor="pageIdx"> Page: </label>
        <input
          type="number"
          id="pageIdx"
          name="pageIdx"
          placeholder="0"
          value={filterByToEdit.pageIdx}
          onChange={handleChange}
        />

        <label htmlFor="labels">labels:</label>
        <input
          type="text"
          id="labels"
          name="labels"
          placeholder="By labels"
          value={filterByToEdit.labels}
          onChange={handleChange}
          ref={elInputRef}
        />

        <button>Filter bugs!</button>
      </form>
      <button onClick={sortByDate}>Sort By Date</button>
      <button onClick={sortBySeverity}>Sort By Severity</button>
      <div className="tags">
        <button onClick={() => filterByTag('critical')}>Critical</button>
        <button onClick={() => filterByTag('need-cr')}>Need CR</button>
        <button onClick={() => filterByTag('dev-branch')}>Dev Branch</button>
      </div>
    </section>
  );
}
