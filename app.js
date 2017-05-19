var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var upload = multer({ dest: 'public/picture/'});
var app = express();
var bdd;

//--- Include
app.use(express.static('public'));
let register_js = require('./include/register');
let log_js = require('./include/login');
let tag_js = require('./include/tag');
let page_js = require('./include/pages');
let profil_js = require('./include/profil');


app.use(session({secret: 'podl5amc-daso12w' }));
let sess;


MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err;
    bdd = base;
});

app.set('view engine', 'ejs');

//--- App.get
app.get('/', (req, res) => {
    page_js.call_page('wall', bdd, res, req.session, null);
});

app.get('/deco', (req, res) => {
    req.session.destroy();
    res.render('pages/index', { page: 'accueil', login: null});
});

app.get('/register', (req, res) => {
    page_js.call_page('register', bdd, res, req.session, null);
});

app.get('/account', (req, res) => {
    page_js.call_page('account', bdd, res, req.session, req.query.login);
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

app.post('/save_bio', upload.fields([]), (req, res) => {
    profil_js.save_bio(req.body, bdd, res, req.session);
});

app.post('/save_info', upload.fields([]), (req, res) => {
    profil_js.save_info(req.body, bdd, res, req.session);
})

app.post('/picture', upload.single('file'), (req, res) => {
    profil_js.picture(req.file.filename, req.body.picture, bdd, res, req.session);
});

app.post('/form', upload.fields([]), (req, res) => {
    profil_js.save_first_form(req.body, bdd, res, req.session);
});

app.post('/form_skip', upload.fields([]), (req, res) => {
    profil_js.skip(bdd, res, req.session);
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
