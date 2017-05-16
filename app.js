var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var upload = multer();
var app = express();
var bdd;

//--- Include
app.use(express.static('public'));
let register_js = require('./include/register');
let log_js = require('./include/login');


app.use(session({secret: 'podl5amc-daso12w' }));
let sess;


MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err;
    bdd = base;
});

app.set('view engine', 'ejs');

//--- App.get
app.get('/', (req, res) => {
    sess = req.session;
    if (!sess.login)
    res.render('pages/index', { page: 'accueil'});
    else
    res.render('pages/form', { page: 'accueil'});
});

app.get('/deco', (req, res) => {
    req.session.destroy();
    res.send('Deco !');
});

app.get('/register', (req, res) => {
    sess = req.session;
    if (!sess.login)
    res.render('pages/register', { page: 'register'});
    else
    res.render('pages/form', { page: 'accueil'});
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

app.post('/login', upload.fields([]), (req, res) => {
    log_js.log_user(req.body, bdd, res, req.session);
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
