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
    }
};

async function find_user(user, bdd, res) {
    let count = await bdd.collection('users').find({$or: [
        {login: user.login},
        {mail: user.mail}
    ]}).count();
    if (count == 0) {
        bdd.collection('users').insertOne({"login": user.login, "pass": user.pass, "mail": user.mail}, (err) => {
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

function check_pass (pass, pass_confirm) {
    if (pass == pass_confirm)
    {
        if (pass.length >= 8)
        {
            return ('ok');
        }
        else
        return ('len');
    }
    else
    return ('diff');
}

function check_mail (mail) {
    if (mail.length > 0)
    return('ok');
    return('error');
}
