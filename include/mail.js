var sendmail = require('sendmail')({ silent: true })

module.exports = {
    pass: (login, bdd, res) => {
        if (login) {
            check_pass(login, bdd, res)
        }
    }
}

//--- async
async function check_pass(login, bdd, res) {
    let regex = new RegExp(["^", login, "$"].join(""), "i");
    let user = await bdd.collection('users').findOne({ login: regex })

    if (user) {
        let key = "";
        let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));
        key += possible.charAt(Math.floor(Math.random() * possible.length));

        await bdd.collection('mail_reset').removeMany({ login: regex })
        await bdd.collection('mail_reset').insertOne({ login: login, key: key })
        sendmail({
            from: 'matcha@matcha.com',
            to: user.mail,
            subject: 'Nouveau mot de passe',
            html: `<h1>Matcha</h1>Lien pour reinitialiser votre mot de passe :
             <a href="http://localhost:3000/new_pass?login=${login}&key=${key}">Lien</a>`,
        })
    }
    res.end('ok')
}
