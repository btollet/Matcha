var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
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
    register.check_login(req.body.login, bdd, (val) => check_login = val);              // Login
    register.check_mail(req.body.mail, bdd, (val) => check_mail = val);                // Mail
    let check_pass = register.check_pass(req.body.pass, req.body.pass_confirm, bdd);    //Pass

    if (check_login == 'ok' && check_pass == 'ok' && check_mail == 'ok')
    {
        bdd.collection('users').insertOne({"login": req.body.login, "pass": req.body.pass, "mail": req.body.mail}, (err) => {
            if (err) return(console.log(err));
            console.log('Bdd add');
        });
    }
    else {
        console.log('----------------------------');
        console.log('Login => ' + check_login);
        console.log('Pass => ' + check_pass);
        console.log('Mail => ' + check_mail);
    }
    res.send('Ok');

});


app.get('/show', (req, res) => {
    let cursor = bdd.collection('users').find();
    cursor.each((err, val) => {
        if (val) console.log(val);
    });
    console.log('');
    res.send('Ok');
});

app.get('/del', (req, res) => {
    bdd.collection('users').deleteMany();
    res.send('Delete');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
