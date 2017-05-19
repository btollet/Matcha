let fs = require('fs');

module.exports = {
    save_first_form: (form, bdd, res, sess) => {
        if (check_gender(form) && check_age(form) && check_orient(form) && check_bio(form)) {
            bdd.collection('users').update({ login: sess.login },
            {
                $set: {
                gender: form.gender,
                age: form.age,
                orientation: form.orientation,
                bio: form.bio,
                first_form: 'ok'}
            });
            sess.first_form = 'ok';
            res.end('ok');
        }
        else
        res.end('error');
    },

    save_bio: (form, bdd, res, sess) => {
        if (check_bio(form)) {
            bdd.collection('users').update({ login: sess.login },
            {
                $set: { bio: form.bio }
            });
            res.end('ok');
        }
        else
        res.end('error');
    },

    picture: (name, type, bdd, res, sess) => {
        check_picture(name, type, bdd, res, sess);
    },

    skip: (bdd, res, sess) => {
        bdd.collection('users').update({ login: sess.login },
        {
            $set: {
            orientation: 'Bisexuel',
            first_form: 'ok' }
        });
        sess.first_form = 'ok';
        console.log(sess);
        res.end('ok');
    }
}


//--- async
async function check_picture (name, type, bdd, res, sess) {
    let exist = await bdd.collection('picture').findOne({
        login: sess.login,
        type: type
    });
    if (exist) {
        fs.unlink('public/picture/' + exist.name, (err) => {
            if (err) throw err;
            console.log('File delete -> ' + exist.name);
        });
        bdd.collection('picture').update({ login: sess.login }, {
            $set: { name: name }
        });
        res.end(name);
    }
    else {
        bdd.collection('picture').insertOne({
            login: sess.login,
            name: name,
            type: type
        });
        res.end(name);
    }
}

//--- function
function check_gender (form) {
    if (form.gender === '♂ Homme' || form.gender === '♀ Femme')
    return(true);
    return(false);
}

function check_age (form) {
    if (form.age >= 16 && form.age <= 120)
    return(true);
    return(false);
}

function check_orient (form) {
    if (form.orientation === 'Heterosexuel' || form.orientation === 'Gay / Lesbienne' || form.orientation === 'Bisexuel')
    return (true);
    return (false);
}

function check_bio (form) {
    let regex = /^[a-zA-Z0-9 \n\r]*$/;

    if (regex.test(form.bio) && form.bio.length <= 500)
    return(true);
    return(false);
}
