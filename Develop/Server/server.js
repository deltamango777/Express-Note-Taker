const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

let notesData = [];

// API Routes
app.get('/api/notes', function(req, res) {
    try {
        // reads the notes from json file
        notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
        // parse it so notesData is an array of objects
        notesData = JSON.parse(notesData);

        // error handling
    } catch (err) {
        console.error(err);
    }
    // send objects to the browser
    res.json(notesData);
});

app.post('/api/notes', function(req, res) {
    try {
      // reads the json file
      notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
      console.log(notesData);

      // parse the data to get an array of the objects
      notesData = JSON.parse(notesData);
      // Set new notes id
      req.body.id = notesData.length;
      // add the new note to the array
      notesData.push(req.body); 
      // write the new note to file
      fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notesData));
      // return the new note to the client
      res.json(req.body);
    } catch (err) {
      throw err;
    }
});

app.delete('/api/notes/:id', function(req, res) {
    try {
      //  reads the json file
      notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
      // parse the data to get an array of the objects
      notesData = JSON.parse(notesData);
      // delete the old note from the array
      notesData = notesData.filter(function(note) {
          return note.id != req.params.id;
      });
      // write the new notes to the file
      fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notesData));

    } catch (err) {
      throw err;
    }
    res.send(notesData);
});

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
