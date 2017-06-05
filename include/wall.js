module.exports = {
    no_option: (bdd, res, sess) => {
        find_by_tag(bdd, res, sess)
    },

    option: (option, bdd, res, sess) => {
        let gender = ['♂ Homme', '♀ Femme']
        if (option.man === 'true' && option.woman === 'false')
        gender[1] = null
        else if (option.man === 'false' && option.woman === 'true')
        gender[0] = null

        let orien = ['Heterosexuel', 'Gay / Lesbienne', 'Bisexuel']
        if (!(option.hetero === option.gay && option.gay === option.bi)) {
            if (option.hetero === 'false')
            orien[0] = null
            if (option.gay === 'false')
            orien[1] = null
            if (option.bi === 'false')
            orien[2] = null
        }
        find_option(option, bdd, res, sess, gender, orien)
    }
}

//--- async
async function find_option(option, bdd, res, sess, gender, orien) {
    let my_tag = await bdd.collection('tag').find({ login: sess.login }).toArray()

    let tags = JSON.parse(option.tags)
    //--- Age / Genre / Orientation / Distance
    let users = await bdd.collection('users').find({
        $and: [ { $or: [ { gender: gender[0] }, { gender: gender[1] } ] },
        { $or: [ { orientation: orien[0] }, { orientation: orien[1] }, { orientation: orien[2] } ] },
        { age: { $gte: parseInt(option.age_min) } },
        { age: { $lte: parseInt(option.age_max) } },
        { login: { $ne: sess.login } } ]
    }).toArray()

    let result = new Object()
    await Promise.all(users.map(async (val) => {
        //--- Score
        let score = await bdd.collection('like').find({ like: val.login }).count()
        if (score >= parseInt(option.score_min) && score <= parseInt(option.score_max)) {
            //--- Tags
            let check_tag = true
            await Promise.all(tags.map(async (tag) => {
                let find = await bdd.collection('tag').findOne({ tag: tag, login: val.login})
                if (!find)
                check_tag = false
            }))
            if (check_tag) {
                let count = 0
                await Promise.all(my_tag.map(async (tag) => {
                    let have_tag = await bdd.collection('tag').findOne({ login: val.login, tag: tag.tag })
                    if (have_tag)
                    count++
                }))
                let pic = await bdd.collection('picture').findOne({ login: val.login, type: 'profil' })
                if (pic)
                pic = pic.name
                result[val.login] = {
                    count: count,
                    gender: val.gender,
                    age: val.age,
                    pic: pic,
                    score: score
                }
            }
        }
    }))

    let to_array = []
    for (var login in result) {
        to_array.push([login, result[login]])
    }

    res.json(to_array)
}

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
                    let score = await bdd.collection('like').find({ like: user.login }).count()
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
                            pic: pic,
                            score: score
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

    res.render('pages/wall', { page: 'wall', login: sess.login, users: to_array })
}
