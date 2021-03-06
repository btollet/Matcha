var express = require('express')
var multer = require('multer')
var MongoClient = require('mongodb').MongoClient
var session = require('express-session')
var sendmail = require('sendmail')()
var geoip = require('geoip-lite')
var geocoder = require('geocoder')
const path = require('path')

var upload = multer({
    dest: 'public/picture/',
    fileFilter: function (req, file, cb) {
        let type = /jpg|jpeg|png|gif/

        if (type.test(path.extname(file.originalname).toLowerCase()))
        nb_picture(cb)
        else
        cb(null, false)
    }
})

var app = express()
var bdd

var server = require('http').createServer(app)
var io = require('socket.io').listen(server)

//--- Include
app.use(express.static('public'))
app.use(express.static(__dirname + '/node_modules'))
let register_js = require('./include/register')
let log_js = require('./include/login')
let tag_js = require('./include/tag')
let page_js = require('./include/pages')
let profil_js = require('./include/profil')
let notif_js = require('./include/notif')
let like_js = require('./include/like.js')
let wall_js = require('./include/wall.js')
let bloque_js = require('./include/bloque.js')
let chat_js = require('./include/chat.js')
let mail_js = require('./include/mail.js')
let install_js = require('./include/install.js')


app.use(session({
    secret: 'podl5amc-daso12w',
    resave: true,
    saveUninitialized: true
}))
let sess


MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err
    bdd = base
})

app.set('view engine', 'ejs')
app.set("trust proxy", true)
//--- Socket io
var notif = io
.of('/notif')
.on('connection', function (socket) {
    socket.emit()
})

var chat = io
.of('/chat')
.on('connection', function (socket) {
    socket.emit()
})

//--- App.get
app.get('/', (req, res) => {
    page_js.call_page('wall', bdd, res, req.session, null, notif)
})

app.get('/deco', (req, res) => {
    req.session.destroy()
    res.render('pages/index', { page: 'accueil', login: null, mes: null })
})

app.get('/register', (req, res) => {
    page_js.call_page('register', bdd, res, req.session, null, notif)
})

app.get('/account', (req, res) => {
    sess = req.session
    page_js.call_page('account', bdd, res, req.session, req.query.login, notif)
})

app.get('/match', (req, res) => {
    page_js.call_page('match', bdd, res, req.session, req.query.login, notif)
})

app.get('/historique', (req, res) => {
    page_js.call_page('historique', bdd, res, req.session, null, notif)
})

app.get('/new_pass', (req, res) => {
    page_js.call_page('new_pass', bdd, res, req.session, req.query, notif)
})

app.get('/install', (req, res) => {
    install_js.gen_bdd(bdd, res)
})


//--- App.post
app.post('/register', upload.fields([]), (req, res) => {
    sess = req.session
    register_js.check_user(req.body, bdd, res)
})

app.post('/login_check', upload.fields([]), (req, res) => {
    sess = req.session
    register_js.check_login(req.body.login, bdd, res)
})

app.post('/mail_check', upload.fields([]), (req, res) => {
    sess = req.session
    register_js.check_mail(req.body.mail, bdd, res)
})

app.post('/login', upload.fields([]), (req, res) => {
    sess = req.session
    log_js.log_user(req.body, bdd, res, req.session)
})

//- profil
app.post('/add_tag', upload.fields([]), (req, res) => {
    tag_js.add_tag(req.body.tag, bdd, res, req.session)
})

app.post('/del_tag', upload.fields([]), (req, res) => {
    tag_js.del_tag(req.body.tag, bdd, res, req.session)
})

app.post('/save_bio', upload.fields([]), (req, res) => {
    profil_js.save_bio(req.body, bdd, res, req.session)
})

app.post('/save_mail', upload.fields([]), (req, res) => {
    profil_js.save_mail(req.body, bdd, res, req.session)
})

app.post('/save_pass', upload.fields([]), (req, res) => {
    profil_js.save_pass(req.body, bdd, res, req.session)
})

app.post('/save_info', upload.fields([]), (req, res) => {
    profil_js.save_info(req.body, bdd, res, req.session)
})

app.post('/picture', upload.single('file'), (req, res) => {
    sess = req.session
    profil_js.picture(req.file, req.body.picture, bdd, res, req.session)
})

app.post('/del_picture', upload.fields([]), (req, res) => {
    profil_js.del_picture(req.body.name, bdd, res, req.session)
})

app.post('/maj_pos', upload.fields([]), (req, res) => {
    if (req.body.city || req.body.auto === 'true')
    profil_js.maj_pos(req.body, bdd, res, req.session, req)
    else
    res.end('error')
})

app.post('/form', upload.fields([]), (req, res) => {
    profil_js.save_first_form(req.body, bdd, res, req.session, req)
})

app.post('/form_skip', upload.fields([]), (req, res) => {
    profil_js.skip(bdd, res, req.session, req)
})

app.post('/notif', (req, res) => {
    notif_js.my_notif(bdd, res, req.session)
})

app.post('/notif_see', (req, res) => {
    notif_js.my_notif_see(bdd, res, req.session)
})

app.post('/notif_del', (req, res) => {
    notif_js.my_notif_del(bdd, res, req.session)
})

app.post('/like', upload.fields([]), (req, res) => {
    like_js.like(req.body.name, bdd, res, req.session, notif)
})

app.post('/bloque', upload.fields([]), (req, res) => {
    bloque_js.bloque(req.body.name, bdd, res, req.session, notif)
})

app.post('/fake', upload.fields([]), (req, res) => {
    bloque_js.fake(req.body.name, bdd, res, req.session, notif)
})

app.post('/search', upload.fields([]), (req, res) => {
    wall_js.option(req.body, bdd, res, req.session)
})

app.post('/new_mes', upload.fields([]), (req, res) => {
    chat_js.new_mes(req.body, bdd, res, req.session, notif, chat)
})

app.post('/chat_load', upload.fields([]), (req, res) => {
    chat_js.chat_load(req.body.login, bdd, res, req.session)
})

app.post('/last_visit', upload.fields([]), (req, res) => {
    chat_js.last_visit(req.body.login, bdd, res, req.session)
})

app.post('/mail_pass', upload.fields([]), (req, res) => {
    mail_js.pass(req.body.login, bdd, res)
})

app.post('/new_pass', upload.fields([]), (req, res) => {
    profil_js.pass_reini(req.body, bdd, res)
})

app.post('/ping', (req, res) => {
    bdd.collection('users').update({ login: req.session.login}, { $set: { last_visit: Date.now() }})
    res.send('pong')
})

//--- Async
async function nb_picture(cb) {
    let count = await bdd.collection('picture').find({ login: sess.login }).count()

    if (count > 6)
    cb(null, false)
    else
    cb(null, true)
}

server.listen(3000, '127.0.0.1')
