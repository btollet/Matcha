let notif_js = require('./notif')

module.exports = {
    like: (name, bdd, res, sess, notif) => {
        check_like(name, bdd, res, sess, notif)
    }
}

//--- async
async function check_like(name, bdd, res, sess, notif) {
    let user_exist = await bdd.collection('users').findOne({ login: name})
    if (user_exist) {
        let is_bloque = await bdd.collection('bloque').findOne({ login: sess.login, bloque: name })
        if (!is_bloque) {
            let is_like = await bdd.collection('like').findOne({ login: sess.login, like: name })
            if (is_like) {
                bdd.collection('like').remove({ login: sess.login, like: name })
                let date = Date.now()
                bdd.collection('historique').insertOne({ login: sess.login, mes: `Vous avez dislike`, date: date, profil: name })
                bdd.collection('historique').insertOne({ login: name, mes: `ne vous like plus`, date: date, profil: sess.login })

                let mes = `<a href="account?login=${sess.login}">${sess.login}</a> ne vous like plus`
                notif_js.send_notif(name, mes, bdd, sess, notif)
                res.end('unlike')
            }
            else {
                let like_me = await bdd.collection('like').findOne({ login: name, like: sess.login})
                let mes
                if (like_me)
                mes = `<a href="account?login=${sess.login}">${sess.login}</a> vous like aussi, le chat est disponnible`
                else
                mes = `<a href="account?login=${sess.login}">${sess.login}</a> vous like`
                bdd.collection('like').insertOne({ login: sess.login, like: name })
                let date = Date.now()
                bdd.collection('historique').insertOne({ login: sess.login, mes: `Vous avez like`, date: date, profil: name })
                bdd.collection('historique').insertOne({ login: name, mes: `vous as like`, date: date, profil: sess.login })
                notif_js.send_notif(name, mes, bdd, sess, notif)
                res.end('like')
            }
        }
        else
        res.end('bloque')
    }
    else
    res.end('error')
}
