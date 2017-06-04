module.exports = {
    like: (name, bdd, res, sess, notif) => {
        check_like(name, bdd, res, sess, notif)
    }
}

//--- async
async function check_like(name, bdd, res, sess, notif) {
    let user_exist = await bdd.collection('users').findOne({ login: name})
    if (user_exist) {
        let is_like = await bdd.collection('like').findOne({ login: sess.login, like: name })
        if (is_like) {
            bdd.collection('like').remove({ login: sess.login, like: name })
            await bdd.collection('notification').insertOne({
                login: name,
                mes: `<a href="account?login=${sess.login}">${sess.login}</a> ne vous like plus`,
                vue: false })
            notif.emit('messages', name)
            res.end('unlike')
        }
        else {
            bdd.collection('like').insertOne({ login: sess.login, like: name })
            await bdd.collection('notification').insertOne({
                login: name,
                mes: `<a href="account?login=${sess.login}">${sess.login}</a> vous like`,
                vue: false })
            notif.emit('messages', name)
            res.end('like')
        }
    }
    else
    res.end('error')
}
