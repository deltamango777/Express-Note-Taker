const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for retrieving all the notes
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'));
});

// POST route for a new note
app.post('/api/notes', (req, res) => {
  // read note data from json file
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

  // create a new note object
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(), // create unique id for the note
  };

  // push newNote into notes array
  notes.push(newNote);

  // write new notes array to json file
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  
  res.json(notes);
});

// * route
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
