module.exports = {
    save_all(form, bdd, res, sess) {
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
            res.end('ok');
        }
        else
        res.end('error');
    }
}


//--- async


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
    if (form.orientation === 'Heterosexuelle' || form.orientation === 'Gay / Lesbienne' || form.orientation === 'Bisexuel')
    return (true);
    return (false);
}

function check_bio (form) {
    let regex = /^[a-zA-Z0-9 ]*$/;

    if (regex.test(form.bio) && form.bio.length <= 500)
    return(true);
    return(false);
}
