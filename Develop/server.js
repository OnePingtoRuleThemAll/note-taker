// dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { create } = require("domain");

// create server
const app = express();

// Port listener
const PORT = process.env.PORT || 3001;

// create note array
let createNoteData = [];

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(_dirname, "public")));

//api route
app.get('/api/notes', function(err, res) {
  try {
    createNoteData = fs.readFileSync("db/db.json", "utf8");
    console.log("Hello there!");
    createNoteData = JSON.parse(createNoteData);
  } catch (err) {
    console.log("\n error (catch err app.get):");
    console.log(err);
  }
   res.json(createNoteData);
});

app.post('/api/notes', function (req, res) {
  try {
    createNoteData = fs.readFileSync("./db/db.json", "utf8");
    console.log(createNoteData);
    createNoteData = JSON.parse(createNoteData);
    req.body.id = createNoteData.length;
    createNoteData.push(req.body);
    createNoteData = JSON.stringify(createNoteData);
    fs.writeFile("./db/db.json", createNoteData, "utf8", function (err) {
      if (err) throw err;
    });

    res.json(JSON.parse(createNoteData));
  } catch (err) {
    throw err;
    console.error(err);
  }
});

//add delete for bonus points

app.delete("/api/notes/:id", function (req, res) {
  try {
    createNoteData = fs.readFileSync("./db/db.json", "utf8");
    createNoteData = JSON.parse(createNoteData);
    createNoteData = createNoteData.filter(function (note) {
      return note.id != req.params.id;
    });
    createNoteData = JSON.stringify(createNoteData);

    fs.writeFile("./db/db.json", createNoteData, "utf8", function (err) {
      if (err) throw err;
    });

    res.send(JSON.parse(createNoteData));
  } catch (err) {
    throw err;
    console.log (err);
  }
});




//html get requests
app.get("/notes", function (req, res) {
  res.sendFile(path.join(_dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(_dirname, "public/index.html"));
});

app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(_dirname, "db/db.json"));
});

app.listen(PORT, function() {
  console.log("server is listening: " + PORT);
});