module.exports = {
    my_notif: (bdd, res, sess) => {
        my_notif_check(bdd, res, sess)
    }
}

//-- async
async function my_notif_check(bdd, res, sess) {
    console.log('Ok');
    let find = await bdd.collection('notification').find({ login: sess.login }).toArray()
    if (find[0]) {
        let result = '';

        find.reverse()
        find.forEach((val) => {
            result += '<hr>' + val.mes;
        })
        res.send(result)
    }
    else
    res.end('Aucune notification')
}
