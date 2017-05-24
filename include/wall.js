module.exports = {
    no_option: (bdd, res, sess) => {
        find_by_tag(bdd, res, sess);
    }
}

//--- async
async function find_by_tag(bdd, res, sess) {
    let my_tag = await bdd.collection('tag').find({ login: sess.login }).toArray();
    let result = new Object();

    await Promise.all(my_tag.map(async (val) => {
        let user_tag = await bdd.collection('tag').find({
            login: { $ne: sess.login },
            tag: val.tag
        }).toArray();
        await Promise.all(user_tag.map(async (user) => {
            if (result[user.login])
            result[user.login]++;
            else
            result[user.login] = 1;
        }));
    }));
    let to_array = [];
    for (var login in result) {
        to_array.push([login, result[login]]);
    }
    await to_array.sort((a, b) => b[1] - a[1] );
    console.log(result);
    console.log(to_array);
    res.render('pages/wall', { page: 'wall', login: sess.login, users: to_array });
}
