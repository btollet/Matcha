module.exports = {
    call_page: (name, bdd, res, sess) => {
            picture_tag(name, bdd, res, sess);
    }
}

//--- async
async function picture_tag(name, bdd, res, sess) {
    let tag = await bdd.collection('tag').find({ login: sess.login }).toArray();
    let picture = await bdd.collection('picture').find({ login: sess.login}).toArray();
    res.render('pages/' + name, { page: 'accueil', tag: tag, pic: picture, login: sess.login});
}
