let wall_js = require('./wall.js')
let match_js = require('./match.js')
let notif_js = require('./notif')

module.exports = {
    call_page: (name, bdd, res, sess, user, notif) => { // User = pour voir profil
        if (!sess.login) {
            if (name === 'register')
            res.render('pages/register', { page: 'register', login: null})
            else if (name === 'new_pass')
            new_pass(name, bdd, res, user)
            else
            res.render('pages/index', { page: 'accueil', login: null, mes: null})
        }
        else if (!sess.first_form)
        picture_tag('form', bdd, res, sess)
        else {
            if (name === 'register')
            picture_tag('wall', bdd, res, sess)
            else if (name === 'account') {
                if (user)
                account(name, bdd, res, sess, user, notif)
                else
                account(name, bdd, res, sess, sess.login, notif)
            }
            else if (name === 'match')
            match_js.match(bdd, res, sess, user)
            else if (name === 'historique')
            historique(name, bdd, res, sess)
            else
            wall_js.no_option(bdd, res, sess)
        }
    }
}

//--- async
async function new_pass(name, bdd, res, user) {
    let valid = false
    let regex = new RegExp(["^", user.login, "$"].join(""), "i")
    let check_entry = await bdd.collection('mail_reset').findOne({ login: regex, key: user.key })

    if (check_entry)
    valid = true

    res.render('pages/' + name, { page: name, login: null, valid: valid, pass_login: user.login, pass_key: user.key })
}

async function historique(name, bdd, res, sess) {
    let histo = await bdd.collection('historique').find({ login: sess.login}).toArray()
    let result = await histo.sort((a, b) => b.date - a.date )

    res.render('pages/' + name, { page: name, login: sess.login, histo: result})
}

async function picture_tag(name, bdd, res, sess) {
    let tag = await bdd.collection('tag').find({ login: sess.login }).toArray()
    let picture = await bdd.collection('picture').find({ login: sess.login}).toArray()
    let fake = await bdd.collection('users').findOne({ login: sess.login, fake: { $gte: 10 } })

    if (fake) {
        sess.destroy()
        res.render('pages/index', { page: 'accueil', login: null, mes: 'Votre compte a ete signaler comme faux' })
    }
    else
    res.render('pages/' + name, { page: name, tag: tag, pic: picture, login: sess.login})
}

async function account(name, bdd, res, sess, user, notif) {
    let fake = await bdd.collection('users').findOne({ login: sess.login, fake: { $gte: 10 } })

    if (fake) {
        sess.destroy()
        res.render('pages/index', { page: 'accueil', login: null, mes: 'Votre compte a ete signaler comme faux' })
    }
    else {
        user = new RegExp(["^", user, "$"].join(""), "i")
        let info = await bdd.collection('users').findOne({ login: user })
        if (!info) {
            user = new RegExp(["^", sess.login, "$"].join(""), "i")
            info = await bdd.collection('users').findOne({ login: user })
        }
        let tag = await bdd.collection('tag').find({ login: user }).toArray()
        let picture = await bdd.collection('picture').find({ login: user }).toArray()
        let score = await bdd.collection('like').find({ like: user }).count()
        let bloque = await bdd.collection('bloque').findOne({ login: sess.login, bloque: user })
        let fake = await bdd.collection('fake').findOne({ login: sess.login, fake: user })

        //--- Like
        let like = await bdd.collection('like').findOne({ login: user, like: sess.login })
        let i_like = await bdd.collection('like').findOne({ login: sess.login, like: user })
        if (like)
        like = 'like me'
        if (i_like) {
            if (like)
            like = 'match'
            else
            like = 'i like'
        }

        //--- Notification
        if (info.login !== sess.login) {
            let mes = `<a href="account?login=${sess.login}">${sess.login}</a> a visiter votre profil`
            notif_js.send_notif(info.login, mes, bdd, sess, notif)

            let date = Date.now()
            bdd.collection('historique').insertOne({ login: sess.login, mes: `Vous avez visiter le profil de`, date: date, profil: info.login })
            bdd.collection('historique').insertOne({ login: info.login, mes: `a visiter votre profil`, date: date, profil: sess.login })

            delete info.mail
            if (info.fake >= 10)
            fake = true;
        }

        delete info.pass
        delete info._id
        delete info.fake
        delete info.pref
        delete info.first_form
        delete info.pos

        res.render('pages/' + name, {
            page: name,
            tag: tag,
            pic: picture,
            login: sess.login,
            user: info,
            like: like,
            bloque: bloque,
            fake: fake,
            score: score
        })
    }
}
