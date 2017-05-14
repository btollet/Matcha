var bcrypt = require('bcrypt');

module.exports = {
    check_user: (user, bdd, res) => {
        if (user.login.length >= 3 && user.login.length <= 10)
        {
            if (check_pass(user.pass, user.pass_confirm) == 'ok' && check_mail(user.mail) == 'ok')
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

async function find_user(user, bdd, res) {
    let count = await bdd.collection('users').find({$or: [
        {login: user.login},
        {mail: user.mail}
    ]}).count();
    if (count == 0) {
        let pass = await bcrypt.hash(user.pass, 10);
        console.log('Pass => ' + pass);
        bdd.collection('users').insertOne({"login": user.login, "pass": pass, "mail": user.mail}, (err) => {
            if (err) return(console.log(err));
            console.log('Bdd add');
        });
        res.end('ok');
    }
    else
    res.end('login Existe');
}

async function login_only(login, bdd, res) {
    let count = await bdd.collection('users').find({login: login}).count();
    if (count == 0)
    res.end('ok');
    else
    res.end('exist');
}

async function mail_only(mail, bdd, res) {
    let count = await bdd.collection('users').find({mail: mail}).count();
    if (count == 0)
    res.end('ok');
    else
    res.end('exist');
}

function check_pass (pass, pass_confirm) {
    if (pass == pass_confirm)
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
