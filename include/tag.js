module.exports = {
    add_tag: (tag, bdd, res, sess) => {
        tag = tag.toLowerCase();
        if (verif_tag(tag))
        add_tag_part2(tag, bdd, res, sess);
        else
        res.end('error');
    },

    del_tag: (tag, bdd, res, sess) => {
        del_tag_part2(tag, bdd, res, sess);
    }
}
//--- Async
async function add_tag_part2(tag, bdd, res, sess) {
    let tag_exist = await bdd.collection('tag').findOne({ login: sess.login, tag: tag });
    if (tag_exist)
    res.end('error');
    else {
        bdd.collection('tag').insertOne({ login: sess.login, tag: tag}, (err) => {
            if (err) return ('error');
        });
        res.end('ok');
    }
}

async function del_tag_part2(tag, bdd, res, sess) {
    bdd.collection('tag').findOneAndDelete({ login: sess.login, tag: tag}, (err, result) => {
        if (err)
        res.end('error');
        else res.end('ok');
    });
}

//--- function
function verif_tag(tag) {
    let regex = /^#([a-zA-Z0-9]{1,20})$/;
    return(regex.test(tag));
}
