var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var upload = multer();
var app = express();
var bdd;

let register = require('./include/register');

MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err;
    bdd = base;
});

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    let test = 'Coucou';
    res.render('pages/index', { test: test});
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', upload.fields([]), (req, res) => {
    register.check_user(req.body, bdd, res);
});

app.post('/login_check', upload.fields([]), (req, res) => {
    register.check_login(req.body.login, bdd, res);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
