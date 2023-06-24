const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');
const dotenv = require('dotenv').config();

app.use(express.static(path.join(__dirname, 'dist')));
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
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
});

app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
});

app.listen(3000);