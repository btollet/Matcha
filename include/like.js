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
                await bdd.collection('notification').insertOne({
                    login: name,
                    mes: `<a href="account?login=${sess.login}">${sess.login}</a> ne vous like plus`,
                    vue: false
                })
                notif.emit('messages', name)
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
                await bdd.collection('notification').insertOne({
                    login: name,
                    mes: mes,
                    vue: false
                })
                notif.emit('messages', name)
                res.end('like')
            }
        }
        else
        res.end('bloque')
    }
    else
    res.end('error')
}
