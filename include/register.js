module.exports = {
    check_login: (login, bdd, callback) => {
        if (login.length >= 3 && login.length <= 10)
        {
            find_user (login, bdd, (val) => callback (val));
        }
        else
        callback ('len');
    },

    check_pass: (pass, pass_confirm, bdd) => {
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
    },

    check_mail: (mail, bdd, callback) => {
        if (mail != '')
        {
            find_mail (mail, bdd, (val) => callback (val));
        }
        else
        callback ('len');
    }
};

function find_user(login, bdd, callback) {
    bdd.collection('users').find({login: login}).toArray((err, result) => {
        if (result[0])
            callback('exist');
        else
            callback('ok');
    });
}

function find_mail(mail, bdd, callback) {
    bdd.collection('users').find({mail: mail}).toArray((err, result) => {
        if (result[0])
            callback('exist');
        else
            callback('ok');
    });
}
