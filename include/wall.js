module.exports = {
    no_option: (bdd, res, sess) => {
        find_by_gender(bdd, res, sess)
    },

    option: (option, bdd, res, sess) => {
        let gender = ['♂ Homme', '♀ Femme']
        if (option.man === 'true' && option.woman === 'false')
        gender[1] = null
        else if (option.man === 'false' && option.woman === 'true')
        gender[0] = null

        let orien = ['Heterosexuel', 'Homosexuel', 'Bisexuel']
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
    let me = await bdd.collection('users').findOne({ login: sess.login })

    let tags = JSON.parse(option.tags)
    //--- Age / Genre / Orientation / Distance
    let users = await bdd.collection('users').find({
        $and: [ { $or: [ { gender: gender[0] }, { gender: gender[1] } ] },
        { $or: [ { orientation: orien[0] }, { orientation: orien[1] }, { orientation: orien[2] } ] },
        { age: { $gte: parseInt(option.age_min) } },
        { age: { $lte: parseInt(option.age_max) } },
        { login: { $ne: sess.login } },
        { fake: { $lt: 10 } } ]
    }).toArray()

    let result = new Object()
    await Promise.all(users.map(async (val) => {
        let is_bloque = await bdd.collection('bloque').findOne({ login: sess.login, bloque: val.login })
        if (!is_bloque) {
            //--- Score
            let score = await bdd.collection('like').find({ like: val.login }).count()
            if (score >= parseInt(option.score_min) && score <= parseInt(option.score_max)) {
                //--- Distance
                let dist = 0
                if (me.pos[0] !== val.pos[0] || me.pos[1] !== val.pos[1])
                dist = distance(me.pos[0], me.pos[1], val.pos[0], val.pos[1])
                if (dist <= parseInt(option.dis)) {
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
                            score: score,
                            dist: dist
                        }
                    }
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

async function find_by_gender(bdd, res, sess) {
    let fake = await bdd.collection('users').findOne({ login: sess.login, fake: { $gte: 10 } })

    if (fake) {
        sess.destroy()
        res.render('pages/index', { page: 'accueil', login: null, mes: 'Votre compte a ete signaler comme faux' })
    }
    else {
        let my_tag = await bdd.collection('tag').find({ login: sess.login }).toArray()
        let me = await bdd.collection('users').findOne({ login: sess.login })
        let result = new Object()

        let users = await bdd.collection('users').find({
            $and: [ { login: { $ne: sess.login } }, { fake: { $lt: 10 } } ]
        }).toArray()

        await Promise.all(users.map(async (val) => {
            let is_bloque = await bdd.collection('bloque').findOne({ login: sess.login, bloque: val.login })
            if (!is_bloque) {
                //--- Genre + Orientation
                if ((!me.pref || me.pref === val.gender) && (!val.pref || val.pref === me.gender )) {
                    //--- Distance
                    let dist = 0
                    if (me.pos[0] !== val.pos[0] || me.pos[1] !== val.pos[1])
                    dist = distance(me.pos[0], me.pos[1], val.pos[0], val.pos[1])
                    //--- Score
                    let score = await bdd.collection('like').find({ like: val.login }).count()
                    //--- Tags
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
                        score: score,
                        dist: dist
                    }
                }
            }
        }))
        //-- To array + Sort
        let to_array = []
        for (var login in result) {
            to_array.push([login, result[login]])
        }
        await to_array.sort((a, b) => (a[1].dist === b[1].dist) ? b[1].count - a[1].count : a[1].dist - b[1].dist)

        res.render('pages/wall', { page: 'wall', login: sess.login, users: to_array })
    }
}

//--- function
function distance(lat1, lon1, lat2, lon2) {
    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
}
