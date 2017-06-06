module.exports = {
    bloque: (name, bdd, res, sess, notif) => {
        bloque_user(name, bdd, res, sess, notif)
    },

    fake: (name, bdd, res, sess, notif) => {
        fake_user(name, bdd, res, sess, notif)
    }
}

//--- async
async function bloque_user(name, bdd, res, sess, notif) {
    let user_exist = await bdd.collection('users').findOne({ login: name })
    if (user_exist) {
        let already_bloque = await bdd.collection('bloque').findOne({ login: sess.login, bloque: name })
        if (already_bloque) {
            bdd.collection('bloque').remove({ login: sess.login, bloque: name })
            res.end('unbloque')
        }
        else {
            bdd.collection('bloque').insertOne({ login: sess.login, bloque: name })
            let is_like = await bdd.collection('like').findOne({ login: sess.login, like: name })
            if (is_like) {
                bdd.collection('like').remove({ login: sess.login, like: name })
                await bdd.collection('notification').insertOne({
                    login: name,
                    mes: `<a href="account?login=${sess.login}">${sess.login}</a> ne vous like plus`,
                    vue: false
                })
                notif.emit('messages', name)
            }
            res.end('bloque')
        }
    }
    else
    res.end('error')
}

async function fake_user(name, bdd, res, sess, notif) {
    let user_exist = await bdd.collection('users').findOne({ login: name })
    if (user_exist) {
        let already_fake = await bdd.collection('fake').findOne({ login: sess.login, fake: name })
        if (!already_fake) {
            bdd.collection('users').updateOne({ login: name }, { $inc: { fake: 1 }})
            bdd.collection('fake').insertOne({ login: sess.login, fake: name })
            bdd.collection('bloque').insertOne({ login: sess.login, bloque: name })
            let is_like = await bdd.collection('like').findOne({ login: sess.login, like: name })
            if (is_like) {
                bdd.collection('like').remove({ login: sess.login, like: name })
                await bdd.collection('notification').insertOne({
                    login: name,
                    mes: `<a href="account?login=${sess.login}">${sess.login}</a> ne vous like plus`,
                    vue: false
                })
                notif.emit('messages', name)
            }
        }
    }
    res.end('ok')
}
