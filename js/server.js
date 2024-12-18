const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Datenbankverbindung
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY, word TEXT, category TEXT, author TEXT)");
});

// Route zum Abrufen aller Wörter
app.get('/words', (req, res) => {
    db.all("SELECT word, category, author FROM words", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Route zum Hinzufügen eines neuen Wortes
app.post('/add-word', (req, res) => {
    const { word, category, author } = req.body;
    db.run("INSERT INTO words (word, category, author) VALUES (?, ?, ?)", [word, category, author], function(err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({ id: this.lastID, word, category, author });
    });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
