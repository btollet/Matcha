var bcrypt = require('bcrypt');

module.exports = {
    log_user: (user, bdd, res, sess) => {
        check_user(user, bdd, res, sess);
    }
}

async function check_user(user, bdd, res, sess) {
    let find = await bdd.collection('users').findOne({ login: user.login });
    if (find) {
        let check_pass = await bcrypt.compare(user.pass, find.pass);
        if (check_pass == true) {
            sess.login = user.login;
            res.end('ok');
        }
        else
        res.end('error');
    }
    else
        res.end('error');
}
