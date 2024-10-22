const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Um statische Dateien zu servieren

// MySQL-Verbindung
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Dein MySQL-Benutzername
    password: 'Fahride123',  // Dein MySQL-Passwort
    database: 'basetix',    // Der Name deiner Datenbank
    port: 3307 // Der host port
});

// Verbindung zur Datenbank herstellen
db.connect((err) => {
    if (err) {
        console.error('Datenbankverbindung fehlgeschlagen: ' + err.stack);
        return;
    }
    console.log('Mit der Datenbank verbunden');
});

// Route für die Root-URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registrierung
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Passwort hashen
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        // Benutzer in die Datenbank einfügen
        db.query('INSERT INTO users (username, password, created_at) VALUES (?, ?, NOW())', [username, hash], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            console.log(`Neuer Benutzer registriert: ${username} (ID: ${result.insertId})`); // Konsolenausgabe
            res.status(201).json({ message: 'Benutzer registriert' });
        });
    });
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Benutzer aus der Datenbank abrufen
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Benutzer nicht gefunden' });
        }

        const user = results[0];

        // Passwort überprüfen
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Passwort falsch' });
            }

            // JWT generieren
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login erfolgreich', token });
        });
    });
});

// Route zum Abrufen aller Benutzer
app.get('/users', (req, res) => {
    db.query('SELECT username, created_at FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
