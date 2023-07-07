const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');
const dotenv = require('dotenv').config();

app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.json());

console.log('Testing server')


// Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'taylorswiftranker'
});

db.connect(function(err) {
    if (err) {
        console.log('DB error');
        throw err;
        return false;
    }
    else {
        console.log('worked db connected')
    }
});

const sessionStore = new MySQLStore({
    expiration:(1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitalized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, db);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/albums', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/globalrankings', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/user/:username', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/taylorswift', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/fearless', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/speaknow', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/red', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/1989', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/reputation', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/lover', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/folklore', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/evermore', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.get('/midnights', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

app.listen(3000);