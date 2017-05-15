var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var upload = multer();
var app = express();
var bdd;

//--- Include
let register_js = require('./include/register');
let log_js = require('./include/log');

app.use(session({secret: 'abc' }));
var sess;


MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err;
    bdd = base;
});

app.set('view engine', 'ejs');

//--- App.get
app.get('/', (req, res) => {
    res.render('pages/index', { page: 'accueil'});
});

app.get('/register', (req, res) => {
    res.render('pages/register', { page: 'register'});
});

app.get('/test', (req, res) => {
    sess = req.session;

    res.send(sess.login);
});

//--- App.post
app.post('/register', upload.fields([]), (req, res) => {
    register_js.check_user(req.body, bdd, res);
});

app.post('/login_check', upload.fields([]), (req, res) => {
    register_js.check_login(req.body.login, bdd, res);
});

app.post('/mail_check', upload.fields([]), (req, res) => {
    register_js.check_mail(req.body.mail, bdd, res);
});

app.post('/log', upload.fields([]), (req, res) => {
    log_js.log_user(req.body, bdd, res, req.session);
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
