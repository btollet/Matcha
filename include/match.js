module.exports = {
    match: (bdd, res, sess, user) => {
        my_match(bdd, res, sess, user)
    }
}

//--- async
async function my_match(bdd, res, sess, user_login) {
    let fake = await bdd.collection('users').findOne({ login: sess.login, fake: { $gte: 10 } })

    if (fake) {
        sess.destroy()
        res.render('pages/index', { page: 'accueil', login: null, mes: 'Votre compte a ete signaler comme faux' })
    }
    else {
        let my_like = await bdd.collection('like').find({ login: sess.login }).toArray()
        let me = await bdd.collection('users').findOne({ login: sess.login })
        let result = new Object()

        //-- Check number tags
        await Promise.all(my_like.map(async (val) => {
            let like_me = await bdd.collection('like').findOne({
                login: val.like,
                like: sess.login
            })
            if (like_me) {
                let user_info = await bdd.collection('users').findOne({ login: val.like, fake: { $lt: 10 } } )
                if (user_info) {
                    let is_bloque = await bdd.collection('bloque').findOne({ login: sess.login, bloque: val.like })
                    if (!is_bloque) {
                        let score = await bdd.collection('like').find({ like: val.like }).count()
                        let pic = await bdd.collection('picture').findOne({ login: val.like, type: 'profil' })
                        if (pic)
                        pic = pic.name
                        result[val.like] = {
                            gender: user_info.gender,
                            pic: pic,
                            last_visit: user_info.last_visit,
                            score: score
                        }
                    }
                }
            }
        }))
        if (user_login && !result[user_login])
            user_login = null;
        //-- To array
        let to_array = []
        for (var login in result) {
            to_array.push([login, result[login]])
        }
        to_array.sort()

        res.render('pages/match', { page: 'match', login: sess.login, users: to_array, default_user: user_login })
    }
}
