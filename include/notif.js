module.exports = {
    my_notif: (bdd, res, sess) => {
        my_notif_check(bdd, res, sess)
    },

    my_notif_see: (bdd, res, sess) => {
        bdd.collection('notification').updateMany({ login: sess.login, vue: false }, { $set: { vue: true }})
        res.end('ok')
    }
}

//-- async
async function my_notif_check(bdd, res, sess) {
    let find = await bdd.collection('notification').find({ login: sess.login }).toArray()
    if (find[0]) {
        let result = ''

        find.reverse()
        res.json(find)
    }
    else
    res.end('Aucune notification')
}
