module.exports = {
    my_notif: (bdd, res, sess) => {
        my_notif_check(bdd, res, sess)
    },

    my_notif_see: (bdd, res, sess) => {
        bdd.collection('notification').updateMany({ login: sess.login, vue: false }, { $set: { vue: true }})
        res.end('ok')
    },

    my_notif_del: (bdd, res, sess) => {
        bdd.collection('notification').removeMany({ login: sess.login, vue: true })
        res.end('ok')
    },

    send_notif: (name, mes, bdd, sess, notif) => {
        add_notif(name, mes, bdd, sess, notif)
    }
}

//-- async
async function my_notif_check(bdd, res, sess) {
    let find = await bdd.collection('notification').find({ login: sess.login }).toArray()
    if (find[0]) {
        find.reverse()
        res.json(find)
    }
    else
    res.end('Aucune notification')
}

async function add_notif(name, mes, bdd, sess, notif) {
    let bloque = await bdd.collection('bloque').findOne({ login: name, bloque: sess.login })

    if (!bloque) {
        await bdd.collection('notification').insertOne({
            login: name,
            mes: mes,
            vue: false
        })
        notif.emit('messages', name)
    }
}
