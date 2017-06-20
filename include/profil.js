let fs = require('fs')
let bcrypt = require('bcrypt')
let geoip = require('geoip-lite')
let geocoder = require('geocoder')

module.exports = {
    save_first_form: (form, bdd, res, sess, req) => {
        if (check_gender(form) && check_age(form) && check_orient(form) && check_bio(form)) {
            //--- Preference
            let pref = null
            let orien = null
            if (form.orientation != 'Bisexuel') {
                if (form.gender === '♂ Homme') {
                    if (form.orientation === 'Heterosexuel')
                    pref = '♀ Femme'
                    else
                    pref = '♂ Homme'
                }
                else {
                    if (form.orientation === 'Heterosexuel')
                    pref = '♂ Homme'
                    else
                    pref = '♀ Femme'
                }
            }
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ip === '127.0.0.1'){
                geocoder.geocode('96 Boulevard Bessières, 75017 Paris' , function ( err, data ) {
                    if (data.results[0]) {
                        pos = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
                        city = data.results[0].address_components[2].long_name
                        bdd.collection('users').update({ login: sess.login }, { $set: { pos: pos, city: city }})
                    }
                })
            }
            else {
                let geo = geoip.lookup(ip)
                bdd.collection('users').update({ login: sess.login }, { $set: { pos: geo.ll, city: geo.city}})
            }

            bdd.collection('users').update({ login: sess.login }, { $set: {
                gender: form.gender,
                age: parseInt(form.age),
                orientation: form.orientation,
                pref: pref,
                bio: form.bio,
                first_form: 'ok',}
            })
            sess.first_form = 'ok'
            res.end('ok')
        }
        else
        res.end('error')
    },

    save_bio: (form, bdd, res, sess) => {
        if (check_bio(form)) {
            bdd.collection('users').update({ login: sess.login }, { $set: { bio: form.bio }})
            res.end('ok')
        }
        else
        res.end('error')
    },

    save_info: (form, bdd, res, sess) => {
        if (check_name(form) && check_gender(form) && check_age(form) && check_orient(form)) {
            //--- Preference
            let pref = null
            let orien = null
            if (form.orientation != 'Bisexuel') {
                if (form.gender === '♂ Homme') {
                    if (form.orientation === 'Heterosexuel')
                    pref = '♀ Femme'
                    else
                    pref = '♂ Homme'
                }
                else {
                    if (form.orientation === 'Heterosexuel')
                    pref = '♂ Homme'
                    else
                    pref = '♀ Femme'
                }
            }
            bdd.collection('users').update({ login: sess.login },{ $set: {
                f_name: form.f_name,
                name: form.name,
                gender: form.gender,
                age: parseInt(form.age),
                orientation: form.orientation,
                pref: pref }
            })
            res.end('ok')
        }
        else
        res.end('error')
    },

    save_mail: (form, bdd, res, sess) => {
        if (check_mail(form))
        check_mail_part2(form, bdd, res, sess)
        else
        res.end('error')
    },

    save_pass: (form, bdd, res, sess) => {
        if (check_pass(form))
        check_pass_part2(form, bdd, res, sess)
        else
        res.end('error1')
    },

    picture: (name, type, bdd, res, sess) => {
        if (name) {
            if (type === 'profil')
            check_picture(name.filename, type, bdd, res, sess)
            else {
                bdd.collection('picture').insertOne({
                    login: sess.login,
                    name: name.filename,
                    type: type
                })
                res.end(name.filename)
            }
        }
        else
        res.end('error')
    },

    del_picture: (name, bdd, res, sess) => {
        check_pic_del(name, bdd, res, sess)
    },

    skip: (bdd, res, sess, req) => {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip === '127.0.0.1') {
            geocoder.geocode('96 Boulevard Bessières, 75017 Paris' , function ( err, data ) {
                if (data.results[0]) {
                    pos = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
                    city = data.results[0].address_components[2].long_name
                    bdd.collection('users').update({ login: sess.login }, { $set: {orientation: 'Bisexuel', first_form: 'ok', pos: pos, city: city }})
                }
            })
        }
        else {
            let geo = geoip.lookup(ip)

            bdd.collection('users').update({ login: sess.login },{ $set: {
                orientation: 'Bisexuel',
                first_form: 'ok',
                pos: geo.ll,
                city: geo.city}
            })
        }
        sess.first_form = 'ok'
        res.end('ok')
    },

    pass_reini: (form, bdd, res) => { // Mot de passe avec lien mail
        if (check_pass(form))
        pass_reini_part2(form, bdd, res)
        else
        res.end('error')
    },

    maj_pos: (form, bdd, res, sess, req) => {
        if (form.auto === 'true') {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ip === '127.0.0.1') {
                geocoder.geocode('96 Boulevard Bessières, 75017 Paris' , function ( err, data ) {
                    if (data.results[0]) {
                        pos = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
                        city = data.results[0].address_components[2].long_name
                        bdd.collection('users').update({ login: sess.login }, { $set: { pos: pos, city: city }})
                        res.json(city)
                    }
                    else
                    res.end('error')
                })
            }
            else {
                let geo = geoip.lookup(ip)
                bdd.collection('users').update({ login: sess.login }, { $set: { pos: geo.ll, city: geo.city }})
                res.json(geo.city)
            }
        }
        else {
            geocoder.geocode(form.city , function ( err, data ) {
                if (data.results[0]) {
                    pos = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
                    city = form.city
                    bdd.collection('users').update({ login: sess.login }, { $set: { pos: pos, city: form.city }})
                    res.json(form.city)
                }
                else
                res.end('error')
            })
        }
    }
}


//--- async
async function check_picture (name, type, bdd, res, sess) {
    let exist = await bdd.collection('picture').findOne({
        login: sess.login,
        type: type
    })
    if (exist) {
        fs.unlink('public/picture/' + exist.name, (err) => {
            if (err) throw err
        })
        bdd.collection('picture').update({ login: sess.login }, {
            $set: { name: name }
        })
        res.end(name)
    }
    else {
        bdd.collection('picture').insertOne({
            login: sess.login,
            name: name,
            type: type
        })
        res.end(name)
    }
}

async function check_mail_part2(form, bdd, res, sess) {
    let regex_mail = new RegExp(["^", form.mail, "$"].join(""), "i")
    let count = await bdd.collection('users').find({$or: [
        {mail: regex_mail}
    ]}).count()

    if (count == 0) {
        bdd.collection('users').update({ 'login': sess.login }, {
            $set: { 'mail': form.mail }
        })
        res.end('ok')
    }
    else
    res.end('error')
}

async function check_pass_part2(form, bdd, res, sess) {
    let find = await bdd.collection('users').findOne({ login: sess.login })
    if (find) {
        let check_pass = await bcrypt.compare(form.old, find.pass)
        if (check_pass == true) {
            let new_pass = await bcrypt.hash(form.pass, 10)
            bdd.collection('users').update({ 'login': sess.login }, {
                $set: { 'pass': new_pass }
            })
            res.end('ok')
        }
        else
        res.end('error')
    }
    else
    res.end('error')
}

async function pass_reini_part2(form, bdd, res) {
    let regex = new RegExp(["^", form.login, "$"].join(""), "i")
    let find = await bdd.collection('users').findOne({ login: regex })
    if (find) {
        let new_pass = await bcrypt.hash(form.pass, 10)
        bdd.collection('users').update({ login: regex }, { $set: { 'pass': new_pass }})
        bdd.collection('mail_reset').remove({ login: regex})
        res.end('ok')
    }
    else
    res.end('error')
}

async function check_pic_del(name, bdd, res, sess) {
    let exist = await bdd.collection('picture').findOne({ login: sess.login, name: name })
    if (exist) {
        bdd.collection('picture').deleteOne({ login: sess.login, name: name })
        fs.unlink('public/picture/' + name, (err) => {
            if (err) throw err
        })
        res.send('ok')
    }
    else
    res.end('error')
}


//--- function
function check_gender (form) {
    if (form.gender === '♂ Homme' || form.gender === '♀ Femme')
    return(true)
    return(false)
}

function check_age (form) {
    if (form.age >= 16 && form.age <= 120)
    return(true)
    return(false)
}

function check_orient (form) {
    if (form.orientation === 'Heterosexuel' || form.orientation === 'Homosexuel' || form.orientation === 'Bisexuel')
    return (true)
    return (false)
}

function check_bio (form) {
    let regex = /^[a-zA-Z0-9 \n\r]*$/

    if (regex.test(form.bio) && form.bio.length <= 500)
    return(true)
    return(false)
}

function check_name(form) {
    let regex = /^[a-zA-Z ]+$/
    if (!form.name || !form.f_name)
    return(false)
    if (regex.test(form.f_name) && regex.test(form.name))
    return(true)
    return(false)
}

function check_mail (form) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (regex.test(form.mail))
    return(true)
    return(false)
}

function check_pass (form) {
    if (form.pass === form.pass_confirm)
    {
        let regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
        if (regex.test(form.pass))
        return (true)
        return (false)
    }
    return (false)
}
