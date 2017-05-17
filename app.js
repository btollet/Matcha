var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var upload = multer({ dest: 'public/picture/', filename: 'test'});
var app = express();
var bdd;

//--- Include
app.use(express.static('public'));
let register_js = require('./include/register');
let log_js = require('./include/login');
let tag_js = require('./include/tag');


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
    res.render('pages/index', { page: 'accueil', login: null});
    else
    form(sess, res);
});

app.get('/deco', (req, res) => {
    req.session.destroy();
    res.render('pages/index', { page: 'accueil', login: null});
});

app.get('/register', (req, res) => {
    sess = req.session;
    if (!sess.login)
    res.render('pages/register', { page: 'register', login: null});
    else
    form(sess, res);
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

app.post('/add_tag', upload.fields([]), (req, res) => {
    tag_js.add_tag(req.body.tag, bdd, res, req.session);
});

app.post('/del_tag', upload.fields([]), (req, res) => {
    tag_js.del_tag(req.body.tag, bdd, res, req.session);
});

app.post('/picture', upload.single('test'), (req, res) => {
    console.log(req.file);
    res.send(req.file.filename);
});

//--- Async
async function form(sess, res) {
    let tag = await bdd.collection('tag').find({ login: sess.login }).toArray();
    res.render('pages/form', { page: 'accueil', tag: tag, login: sess.login});
}


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
