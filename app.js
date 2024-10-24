const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const saltRounds = 10;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Datenbankverbindung
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Fahride123',
  database: 'basetix_db',
});

db.connect((err) => {
  if (err) {
    console.error('Datenbankverbindung fehlgeschlagen: ', err);
  } else {
    console.log('Mit der Datenbank verbunden.');
  }
});

// Routen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Registrierung
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Passwort hashen
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hash], (err, result) => {
      if (err) {
        console.error(err);
        res.send('Fehler bei der Registrierung.');
      } else {
        res.send('Erfolgreich registriert!');
      }
    });
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      res.send('Fehler bei der Anmeldung.');
    } else if (results.length === 0) {
      res.send('Benutzer nicht gefunden.');
    } else {
      const user = results[0];

      // Passwortvergleich
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.send(`Willkommen, ${user.username}!`);
        } else {
          res.send('Falsches Passwort.');
        }
      });
    }
  });
});

// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});
