var bcrypt = require('bcrypt');

module.exports = {
    log_user: (user, bdd, res, sess) => {
        check_user(user, bdd, res, sess);
    }
}

async function check_user(user, bdd, res, sess) {
    let regex = new RegExp(["^", user.login, "$"].join(""), "i");
    let find = await bdd.collection('users').findOne({ login: regex });
    if (find) {
        let check_pass = await bcrypt.compare(user.pass, find.pass);
        if (check_pass == true) {
            sess.login = find.login;
            sess.first_form = find.first_form;
            res.end('ok');
        }
        else
        res.end('error');
    }
    else
        res.end('error');
}
