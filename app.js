var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var upload = multer();
var app = express();
var bdd;

MongoClient.connect('mongodb://localhost:27017', (err, base) => {
    if (err) throw err;
    bdd = base;
});

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('pages/index');
});

app.post('/register', upload.fields([]), (req, res) => {
    console.log(req.body);
    if (req.body.login != null && req.body.pass != '')
    {
        bdd.collection('users').insertOne({"login": req.body.login, "pass": req.body.pass}, (err) => {
            if (err) return(console.log(err));
            console.log('Bdd add');
        });
        res.send('Ok');
    }
    else res.send('Error');
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