var bcrypt = require('bcrypt');

module.exports = {
    check_user: (user, bdd, res) => {
        if (user.login.length >= 3 && user.login.length <= 10)
        {
            if (check_pass(user.pass, user.pass_confirm) == 'ok' && check_mail(user.mail) == 'ok' && check_name(user.f_name, user.name) == 'ok')
            find_user(user, bdd, res);
            else
            res.end('Password ou mail err');
        }
        else
        res.end('Login len');
    },

    check_login: (login, bdd, res) => {
        login_only(login, bdd, res);
    },

    check_mail: (mail, bdd, res) => {
        mail_only(mail, bdd, res);
    }
};

//--- async
async function find_user(user, bdd, res) {
    let regex_user = new RegExp(["^", user.login, "$"].join(""), "i");
    let regex_mail = new RegExp(["^", user.mail, "$"].join(""), "i");
    let count = await bdd.collection('users').find({$or: [
        {login: regex_user},
        {mail: regex_mail}
    ]}).count();

    if (count == 0) {
        let pass = await bcrypt.hash(user.pass, 10);
        bdd.collection('users').insertOne({
            "login": user.login,
            "f_name": user.f_name,
            "name": user.name,
            "pass": pass,
            "mail": user.mail,
            "gender": '',
            "age": '',
            "orientation": '',
            "bio": '',
            "first_form": '',
            "fake": 0
        }, (err) => {
            if (err) return(console.log(err));
            console.log('Bdd add user: ' + user.login);
        });
        res.end('ok');
    }
    else
    res.end('login Existe');
}

async function login_only(login, bdd, res) {
    let regex = new RegExp(["^", login, "$"].join(""), "i");
    let count = await bdd.collection('users').find({login: regex}).count();
    if (count == 0)
    res.end('ok');
    else
    res.end('exist');
}

async function mail_only(mail, bdd, res) {
    let regex = new RegExp(["^", mail, "$"].join(""), "i");
    let count = await bdd.collection('users').find({mail: regex}).count();
    if (count == 0)
    res.end('ok');
    else
    res.end('exist');
}


//--- function
function check_pass (pass, pass_confirm) {
    if (pass === pass_confirm)
    {
        let regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        if (regex.test(pass))
        return ('ok');
        return ('len');
    }
    return ('diff');
}

function check_mail (mail) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(mail))
    return('ok');
    return('error');
}

function check_name(f_name, name) {
    let regex = /^[a-zA-Z ]+$/;
    if (!name || !f_name)
    return('error');
    if (regex.test(f_name) && regex.test(name))
    return('ok');
    return('error');
}
