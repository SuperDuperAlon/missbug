const express = require("express");
const cookieParser = require("cookie-parser");
const bugService = require("./services/bug.service.js");
const userService = require("./services/user.service.js");

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

/////////// BUGS API ////////////

// query
app.get("/api/bug", (req, res) => {
  const filterBy = req.query;
  bugService
    .query(filterBy)
    .then((bugs) => {
      res.send(bugs);
    })
    .catch((err) => {
      console.log("Error", err);
      res.status(400).send("cannot send bugs");
    });
});

// Update
app.put("/api/bug/:bugId", (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(400).send('cannot update bug')

  const bug = req.body;
  bugService.save(bug, loggedinUser)
  .then((savedBug) => {
    res.send(savedBug);
  }).catch(err => {
    console.log('Error:', err)
    res.status(400).send('Cannot update car')
})
});

// Create
app.post("/api/bug", (req, res) => {

const loggedinUser = userService.validateToken(req.cookies.loginToken)
if (!loggedinUser) return res.status(401).send('Cannot add new bug')

  const bug = req.body;

  bugService.save(bug, loggedinUser)
  .then((savedBug) => {
    res.send(savedBug);
  }).catch(err => {
    console.log('Error:', err)
    res.status(400).send('Cannot create bug')
})
});

// Read - GetById
app.get("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params;

  let visitedBugsIds = req.cookies.visitedBugsIds || [];

  if (!visitedBugsIds.includes(bugId)) {
    if (visitedBugsIds.length === 3)
      return res.status(401).send("Wait for a bit");
    visitedBugsIds.push(bugId);
  }

  bugService.get(bugId)
    .then((bug) => {
      res
        .cookie("visitedBugsIds", visitedBugsIds, { maxAge: 1000 * 7 })
        .send(bug);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

// remove
app.delete("/api/bug/:bugId", (req, res) => {



  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot update bug')

  const { bugId } = req.params;
  
  bugService.remove(bugId).then(() => {
    res.send({ msg: "Bugs removed successfully", bugId });
  }).catch(err => {
    console.log('Error:', err)
    res.status(400).send('Cannot delete car')
})
});

/////////// USERS API ////////////

/// query
app.get("/api/user", (req, res) => {
  const filterBy = req.query;
  userService
    .query(filterBy)
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(400).send("cannot get users");
    });
});

/// query by Id
app.get("/api/user/:userId", (req, res) => {
  const { userId } = req.params;
  userService
    .get(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(400).send("cannot get users");
    });
});

app.post("/api/user/login", (req, res) => {
  console.log('we entered');
  const { username, password } = req.body;
  userService.getLoginToken({ username, password })
    .then((user) => {
      const loginToken = userService.getLoginToken(user);
      res.cookie("loginToken", loginToken);
      res.send(user);
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(400).send("cannot login");
    });
});


app.post('/api/user/signup', (req, res) => {
  const {fullname, username, password} = req.body
  userService.signup({fullname, username, password})
  .then((user) => {
    const loginToken = userService.getLoginToken(user)
    res.cookie('loginToken', loginToken)
    res.send(user)
  }).catch(err => {
    console.log(err);
    res.status(400).send('Cannot signup')
  })
})

app.post('/api/user/logout', (req, res) => {
  res.clearCookie('loginToken')
  req.send('Logged Out')
})

app.listen(3030, () => console.log("Server runs at http://127.0.0.1:3030"));
