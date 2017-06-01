var express = require('express')
var multer = require('multer')
var MongoClient = require('mongodb').MongoClient
var session = require('express-session')
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


app.use(session({secret: 'podl5amc-daso12w' }))
let sess


MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err
    bdd = base
})

app.set('view engine', 'ejs')

//--- Socket io
var notif = io
  .of('/notif')
  .on('connection', function (socket) {
    socket.emit()
  })

//--- App.get
app.get('/', (req, res) => {
    page_js.call_page('wall', bdd, res, req.session, null)
})

app.get('/deco', (req, res) => {
    req.session.destroy()
    res.render('pages/index', { page: 'accueil', login: null})
})

app.get('/register', (req, res) => {
    page_js.call_page('register', bdd, res, req.session, null)
})

app.get('/account', (req, res) => {
    sess = req.session
    page_js.call_page('account', bdd, res, req.session, req.query.login)
})


//--- App.post
app.post('/register', upload.fields([]), (req, res) => {
    register_js.check_user(req.body, bdd, res)
})

app.post('/login_check', upload.fields([]), (req, res) => {
    register_js.check_login(req.body.login, bdd, res)
})

app.post('/mail_check', upload.fields([]), (req, res) => {
    register_js.check_mail(req.body.mail, bdd, res)
})

app.post('/login', upload.fields([]), (req, res) => {
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

app.post('/form', upload.fields([]), (req, res) => {
    profil_js.save_first_form(req.body, bdd, res, req.session)
})

app.post('/form_skip', upload.fields([]), (req, res) => {
    profil_js.skip(bdd, res, req.session)
})

app.post('/notif', (req, res) => {
    notif_js.my_notif(bdd, res, req.session)
})


//--- Async
async function nb_picture(cb) {
    let count = await bdd.collection('picture').find({ login: sess.login }).count()

    if (count >= 6)
    cb(null, false)
    else
    cb(null, true)
}

async function test(req) {
    await bdd.collection('notification').insertOne({ login: req.query.login, mes: req.query.mes, vue: false });
    notif.emit('messages', req.query.login)
}


app.get('/test', (req, res) => {
    test(req);
    res.send(req.query.mes + ' -> ' + req.query.login)
})

server.listen(3000, () => {
    console.log('Listening on port 3000')
})
