const { useState, useEffect } = React;
const { useNavigate, useParams, Link } = ReactRouterDOM;

import { bugService } from "../services/bug.service.js";
import {
  eventBusService,
  showSuccessMsg,
} from "../services/event-bus.service.js";

export function BugEdit() {
  const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug());
  const navigate = useNavigate();
  const { bugId } = useParams();

  useEffect(() => {
    if (!bugId) return;
    loadBug();
  }, []);

  function loadBug() {
    bugService.getById(bugId)
      .then((bug) => setBugToEdit(bug))
      .catch((err) => {
        console.log("Had issues in bug details", err);
        navigate("/bug");
      });
  }

  function handleChange({ target }) {
    let { value, type, name: field } = target;
    value = type === "number" ? +value : value;
    setBugToEdit((prevbug) => ({ ...prevbug, [field]: value }));
  }

  function onSavebug(ev) {
    ev.preventDefault();
    bugService.save(bugToEdit).then((bug) => {
      console.log("bug saved", bug);
      showSuccessMsg("bug saved!");
      navigate("/bug");
    });
  }

  return (
    <section className="bug-edit">
      <h2>{bugToEdit._id ? "Edit this bug" : "Add a new bug"}</h2>

      <form onSubmit={onSavebug}>
        <label htmlFor="title">Title : </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter title..."
          value={bugToEdit.title}
          onChange={handleChange}
        />
        <label htmlFor="severity">Severity : </label>
        <input
          type="number"
          name="severity"
          id="severity"
          placeholder="Enter severity..."
          value={bugToEdit.severity}
          onChange={handleChange}
        />

        <div>
          <button>{bugToEdit._id ? "Save" : "Add"}</button>
          <Link to="/bug">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
