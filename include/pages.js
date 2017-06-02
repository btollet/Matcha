let wall_js = require('./wall.js')

module.exports = {
    call_page: (name, bdd, res, sess, user) => { // User = pour voir profil
        if (!sess.login) {
            if (name === 'register')
            res.render('pages/register', { page: 'register', login: null})
            else
            res.render('pages/index', { page: 'accueil', login: null})
        }
        else if (!sess.first_form)
            picture_tag('form', bdd, res, sess)
        else {
            if (name === 'register')
            picture_tag('wall', bdd, res, sess)
            else if (name === 'account') {
                if (user)
                account(name, bdd, res, sess, user)
                else
                account(name, bdd, res, sess, sess.login)
            }
            else
            wall_js.no_option(bdd, res, sess)
        }
    }
}

//--- async
async function picture_tag(name, bdd, res, sess) {
    let tag = await bdd.collection('tag').find({ login: sess.login }).toArray()
    let picture = await bdd.collection('picture').find({ login: sess.login}).toArray()

    res.render('pages/' + name, { page: name, tag: tag, pic: picture, login: sess.login})
}

async function account(name, bdd, res, sess, user) {
    user = new RegExp(["^", user, "$"].join(""), "i")
    let info = await bdd.collection('users').findOne({ login: user })
    if (!info) {
        user = new RegExp(["^", sess.login, "$"].join(""), "i")
        info = await bdd.collection('users').findOne({ login: user })
    }
    let tag = await bdd.collection('tag').find({ login: user }).toArray()
    let picture = await bdd.collection('picture').find({ login: user }).toArray()
    let like = await bdd.collection('like').findOne({ login: user, like: sess.login })
    if (like)
        like = 'like me'
    let i_like = await bdd.collection('like').findOne({ login: sess.login, like: user })
    if (i_like) {
        if (like)
        like = 'match'
        else
        like = 'i like'
    }
    if (!info.login === sess.login)
    info.mail = null

    res.render('pages/' + name, {
        page: name,
        tag: tag,
        pic: picture,
        login: sess.login,
        user: info,
        like: like })
}
