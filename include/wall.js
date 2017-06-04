module.exports = {
    no_option: (bdd, res, sess) => {
        find_by_tag(bdd, res, sess)
    }
}

//--- async
async function find_by_tag(bdd, res, sess) {
    let my_tag = await bdd.collection('tag').find({ login: sess.login }).toArray()
    let me = await bdd.collection('users').findOne({ login: sess.login })
    let result = new Object()

    //-- Check number tags
    await Promise.all(my_tag.map(async (val) => {
        let user_tag = await bdd.collection('tag').find({
            login: { $ne: sess.login },
            tag: val.tag
        }).toArray()
        await Promise.all(user_tag.map(async (user) => {
            let user_info = await bdd.collection('users').findOne({ login: user.login })
            if (user_info) {
                if ((!me.pref || me.pref === user_info.gender) && (!user_info.pref || user_info.pref === me.gender )) {
                    let pic = await bdd.collection('picture').findOne({ login: user.login, type: 'profil' })
                    if (pic)
                    pic = pic.name
                    if (result[user.login])
                    result[user.login].count++
                    else {
                        result[user.login] = {
                            count: 1,
                            gender: user_info.gender,
                            age: user_info.age,
                            pic: pic
                        }
                    }
                }
            }
        }))
    }))

    //-- To array + Sort
    let to_array = []
    for (var login in result) {
        to_array.push([login, result[login]])
    }
    await to_array.sort((a, b) => b[1].count - a[1].count)

    //-- Score
    await Promise.all(to_array.map(async (val) => {
        val[1].score = await bdd.collection('like').find({ like: val[0]}).count()
    }))

    res.render('pages/wall', { page: 'wall', login: sess.login, users: to_array })
}
