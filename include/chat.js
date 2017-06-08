let notif_js = require('./notif')

module.exports = {
    new_mes: (info, bdd, res, sess, notif, chat) => {
        let regex = /^[a-zA-Z0-9 \n\r.,!?()#éèêà]*$/

        if (regex.test(info.mes) && info.mes.length && info.mes.length <= 500)
        new_mes_check(info, bdd, res, sess, notif, chat)
        else
        res.end('error')
    },

    chat_load: (login, bdd, res, sess) => {
        load(login, bdd, res, sess)
    },

    last_visit: (login, bdd, res, sess) => {
        last(login, bdd, res, sess)
    }
}

//--- async
async function new_mes_check(info, bdd, res, sess, notif, chat) {
    let i_like = await bdd.collection('like').findOne({ login: sess.login, like: info.login })
    let he_like = await bdd.collection('like').findOne({ login: info.login, like: sess.login })

    if (i_like && he_like) {
        await bdd.collection('chat').insertOne({
            login: sess.login,
            dest: info.login,
            mes: info.mes,
            date: Date.now()
        })
        let mes = `<a href="match?login=${sess.login}">${sess.login}</a> vous a envoyer un message`
        notif_js.send_notif(info.login, mes, bdd, sess, notif)
        chat.emit('chat', info.login)
    }
    res.end('ok')
}

async function load(login, bdd, res, sess) {
    let result = []
    let i_like = await bdd.collection('like').findOne({ login: sess.login, like: login })
    let he_like = await bdd.collection('like').findOne({ login: login, like: sess.login })

    if (i_like && he_like) {
        let mes = await bdd.collection('chat').find({
            $or: [ { login: sess.login, dest: login } ,
                 { login: login, dest: sess.login } ]
        }).toArray()
        result = await mes.sort((a, b) => a.date - b.date )
    }
    res.json(result)
}

async function last(login, bdd, res, sess) {
    let user = await bdd.collection('users').findOne({ login: login })

    if (user) {
        if (user.last_visit)
        res.json(user.last_visit)
        else
        res.end('error')
    }
    else
        res.end('error')
}
