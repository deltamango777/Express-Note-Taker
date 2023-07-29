const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let notesData = [];

// API Routes
app.get('/api/notes', function(req, res) {
    try {
        notesData = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
        notesData = JSON.parse(notesData);
    } catch (err) {
        console.error(err);
    }
    res.json(notesData);
});

app.post('/api/notes', function(req, res) {
    try {
      notesData = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
      console.log(notesData);
      notesData = JSON.parse(notesData);
      req.body.id = notesData.length;
      notesData.push(req.body); 
      fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notesData));
      res.json(req.body);
    } catch (err) {
      throw err;
    }
});

app.delete('/api/notes/:id', function(req, res) {
    try {
      notesData = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
      notesData = JSON.parse(notesData);
      notesData = notesData.filter(function(note) {
          return note.id != req.params.id;
      });
      fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notesData));

    } catch (err) {
      throw err;
    }
    res.send(notesData);
});

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
