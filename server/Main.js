const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');
const dotenv = require('dotenv').config();
const fs = require('fs');
const https = require('https');
const http = require('http');

// app.enable('trust proxy')
// app.use((req, res, next) => {
//     if (req.protocol === 'http' && req.get('X-Forwarded-Proto') !== 'https') {
//       res.redirect(`https://${req.get('Host')}${req.url}`);
//     } else {
//       next();
//     }
//   });
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.json());

// function isSecure(req) {
//     if (req.headers['x-forwarded-proto']) {
//       return req.headers['x-forwarded-proto'] === 'https';
//     }
//     return req.secure;
//   };

//   app.use((req, res, next) => {
//     if (!isSecure(req)) {
//       res.redirect(301, `https://${req.headers.host}${req.url}`);
//     } else {
//       next();
//     }
//   });

console.log('Testing server')

// const key = fs.readFileSync('private.key')
// const cert = fs.readFileSync('certificate.crt')

// const cred = {
//     key,
//     cert
// }
// Database
var db = mysql.createConnection({
    // host     : process.env.RDS_HOSTNAME,
    // user     : process.env.RDS_USERNAME,
    // password : process.env.RDS_PASSWORD,
    // port     : process.env.RDS_PORT,
    // database : process.env.RDS_DATABASE
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'taylorswiftranker'

    
});
console.log('Before connecting to the database.');
db.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});
console.log('After connecting to the database.');

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

app.get('/about', function(req, res) {
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

app.get('/songs', function(req, res) {
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

app.get('/thetorturedpoetsdepartment', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});




// const httpsServer = https.createServer(cred, app);
// httpsServer.listen(8443, () => {
//   console.log('HTTPS server is running on port 8443');
// });

const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log('HTTP server is running on port 3000');
});
