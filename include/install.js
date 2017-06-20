var bcrypt = require('bcrypt')

module.exports = {
    gen_bdd: (bdd, res) => {
        add_users(bdd, res)
    }
}

//--- async
async function add_users(bdd, res) {
    let count = await bdd.collection('users').find().count()
    if (count === 0) {
        let pass = await bcrypt.hash('123456Aa', 10)
        //--- User
        bdd.collection('users').insert({ "login" : "M_Houde", "f_name" : "Houde", "name" : "Martin", "pass" : pass, "mail" : "MartinHoude@jourrapide.com", "gender" : "♂ Homme", "age" : 30, "orientation" : "Heterosexuel", "bio" : "Martin Houde bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497966226535, "pref" : "♀ Femme", "pos" : [ 44.837789, -0.57918 ], "city" : "Bordeaux" })
        bdd.collection('users').insert({ "login" : "A_Chauvet", "f_name" : "Chauvet", "name" : "Arridano", "pass" : pass, "mail" : "ArridanoChauvet@dayrep.com", "gender" : "♂ Homme", "age" : 66, "orientation" : "Heterosexuel", "bio" : "Arridano Chauvet bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497966692415, "pref" : "♀ Femme", "pos" : [ 48.822484, 2.288405 ], "city" : "VANVES" })
        bdd.collection('users').insert({ "login" : "E_Boisclai", "f_name" : "Boisclair", "name" : "Evrard", "pass" : pass, "mail" : "EvrardBoisclair@teleworm.us", "gender" : "♂ Homme", "age" : 44, "orientation" : "Homosexuel", "bio" : "Evrard Boisclair bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497966910358, "pref" : "♂ Homme", "pos" : [ 48.856614, 2.3522219 ], "city" : "Paris" })
        bdd.collection('users').insert({ "login" : "A_Barjavel", "f_name" : "Barjavel", "name" : "Aubrey", "pass" : pass, "mail" : "AubreyBarjavel@dayrep.com", "gender" : "♂ Homme", "age" : 30, "orientation" : "Homosexuel", "bio" : "Aubrey Barjavel bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967124288, "pref" : "♂ Homme", "pos" : [ 48.787899, 2.190408 ], "city" : "VÉLIZY-VILLACOUBLAY" })
        bdd.collection('users').insert({ "login" : "P_Sirois", "f_name" : "Sirois", "name" : "Peppin", "pass" : pass, "mail" : "PeppinSirois@dayrep.com", "gender" : "♂ Homme", "age" : 81, "orientation" : "Bisexuel", "bio" : "Peppin Sirois bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967253390, "pref" : null, "pos" : [ 45.698938, 4.947071 ], "city" : "SAINT-PRIEST" })
        bdd.collection('users').insert({ "login" : "J_Bertrand", "f_name" : "Bertrand", "name" : "Jeoffroi", "pass" : pass, "mail" : "JeoffroiBertrand@dayrep.com", "gender" : "♂ Homme", "age" : 34, "orientation" : "Bisexuel", "bio" : "Jeoffroi Bertrand bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967462141, "pref" : null, "pos" : [ 48.9392651, 2.6126899 ], "city" : "VILLEPARISIS" })
        bdd.collection('users').insert({ "login" : "J_Josseaum", "f_name" : "Josseaume", "name" : "Jeanette", "pass" : pass, "mail" : "JeanetteJosseaume@jourrapide.com", "gender" : "♂ Homme", "age" : 52, "orientation" : "Heterosexuel", "bio" : "Jeanette Josseaume bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967620129, "pref" : "♀ Femme", "pos" : [ 48.773605, 5.158238000000001 ], "city" : "BAR-LE-DUC" })
        bdd.collection('users').insert({ "login" : "E_Douffet", "f_name" : "Douffet", "name" : "Edmee", "pass" : pass, "mail" : "EdmeeDouffet@rhyta.com", "gender" : "♀ Femme", "age" : 82, "orientation" : "Heterosexuel", "bio" : "Edmee Douffet bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967729922, "pref" : "♂ Homme", "pos" : [ 44.930953, 2.444997 ], "city" : "AURILLAC" })
        bdd.collection('users').insert({ "login" : "O_Royer", "f_name" : "Royer", "name" : "Ophelia", "pass" : pass, "mail" : "OpheliaRoyer@rhyta.com", "gender" : "♀ Femme", "age" : 82, "orientation" : "Homosexuel", "bio" : "Ophelia Royer bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967835745, "pref" : "♀ Femme", "pos" : [ 48.6851259, 2.349282 ], "city" : "SAVIGNY-SUR-ORGE" })
        bdd.collection('users').insert({ "login" : "T_Thibault", "f_name" : "Thibault", "name" : "Trinette", "pass" : pass, "mail" : "TrinetteThibault@rhyta.com", "gender" : "♀ Femme", "age" : 73, "orientation" : "Homosexuel", "bio" : "Trinette Thibault bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497967961301, "pref" : "♀ Femme", "pos" : [ 47.081012, 2.398782 ], "city" : "BOURGES" })
        bdd.collection('users').insert({ "login" : "N_Labbe", "f_name" : "Labbe", "name" : "Natalie", "pass" : pass, "mail" : "NatalieLabbe@armyspy.com", "gender" : "♀ Femme", "age" : 31, "orientation" : "Bisexuel", "bio" : "Natalie Labbe bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497968075700, "pref" : null, "pos" : [ 51.015681, 2.397046 ], "city" : "COUDEKERQUE-BRANCHE" })
        bdd.collection('users').insert({ "login" : "D_Chnadonn", "f_name" : "Chnadonnet", "name" : "Dixie", "pass" : pass, "mail" : "DixieChnadonnet@rhyta.com", "gender" : "♀ Femme", "age" : 72, "orientation" : "Bisexuel", "bio" : "Dixie Chnadonnet bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497968180890, "pref" : null, "pos" : [ 48.87753499999999, 2.59016 ], "city" : "CHELLES" })
        bdd.collection('users').insert({ "login" : "A_Norbert", "f_name" : "Norbert", "name" : "Agate", "pass" : pass, "mail" : "AgateNorbert@jourrapide.com", "gender" : "♀ Femme", "age" : 19, "orientation" : "Heterosexuel", "bio" : "Agate Norbert bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497970143938, "pref" : "♂ Homme", "pos" : [ 48.89668380000001, 2.3183755 ], "city" : "Paris" })
        bdd.collection('users').insert({ "login" : "H_Charlebo", "f_name" : "Charlebois", "name" : "Henry", "pass" : pass, "mail" : "HenryCharlebois@jourrapide.com", "gender" : "♂ Homme", "age" : 25, "orientation" : "Heterosexuel", "bio" : "Henry Charlebois bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497970292972, "pref" : "♀ Femme", "pos" : [ 48.89668380000001, 2.3183755 ], "city" : "Paris" })
        bdd.collection('users').insert({ "login" : "V_Charest", "f_name" : "Charest", "name" : "Victor", "pass" : pass, "mail" : "VictorCharest@rhyta.com", "gender" : "♂ Homme", "age" : 22, "orientation" : "Bisexuel", "bio" : "Victor Charest bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497970411483, "pref" : null, "pos" : [ 48.89668380000001, 2.3183755 ], "city" : "Paris" })
        bdd.collection('users').insert({ "login" : "R_Dionne", "f_name" : "Dionne", "name" : "Roxanne", "pass" : pass, "mail" : "RoxanneDionne@dayrep.com", "gender" : "♀ Femme", "age" : 21, "orientation" : "Bisexuel", "bio" : "Roxanne Dionne bio", "first_form" : "ok", "fake" : 0, "last_visit" : 1497970646624, "pref" : null, "pos" : [ 48.89668380000001, 2.3183755 ], "city" : "Paris" })

        //--- picture
        bdd.collection('picture').insert({ login: "M_Houde", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "A_Chauvet", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "E_Boisclai", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "A_Barjavel", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "P_Sirois", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "J_Bertrand", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "E_Douffet", name: 'woman.jpg', type: 'profil'})
        bdd.collection('picture').insert({ login: "O_Royer", name: 'woman.jpg', type: 'profil'})
        bdd.collection('picture').insert({ login: "T_Thibault", name: 'woman.jpg', type: 'profil'})
        bdd.collection('picture').insert({ login: "D_Chnadonn", name: 'woman.jpg', type: 'profil'})
        bdd.collection('picture').insert({ login: "A_Norbert", name: 'woman.jpg', type: 'profil'})
        bdd.collection('picture').insert({ login: "H_Charlebo", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "V_Charest", name: 'man.jpeg', type: 'profil'})
        bdd.collection('picture').insert({ login: "R_Dionne", name: 'woman.jpg', type: 'profil'})

        //--- tag
        bdd.collection('tag').insert({ login: "M_Houde", tag: '#test'})
        bdd.collection('tag').insert({ login: "P_Sirois", tag: '#test'})
        bdd.collection('tag').insert({ login: "J_Bertrand", tag: '#test'})
        bdd.collection('tag').insert({ login: "E_Douffet", tag: '#test'})
        bdd.collection('tag').insert({ login: "O_Royer", tag: '#test'})
        bdd.collection('tag').insert({ login: "T_Thibault", tag: '#test'})
        bdd.collection('tag').insert({ login: "V_Charest", tag: '#test'})
        bdd.collection('tag').insert({ login: "R_Dionne", tag: '#test'})
        bdd.collection('tag').insert({ login: "M_Houde", tag: '#test2'})
        bdd.collection('tag').insert({ login: "J_Bertrand", tag: '#test2'})
        bdd.collection('tag').insert({ login: "E_Douffet", tag: '#test2'})
        bdd.collection('tag').insert({ login: "O_Royer", tag: '#test2'})
        bdd.collection('tag').insert({ login: "T_Thibault", tag: '#test2'})
        bdd.collection('tag').insert({ login: "D_Chnadonn", tag: '#test2'})

        //--- like
        bdd.collection('like').insert({ login: "M_Houde", like: 'A_Chauvet'})
        bdd.collection('like').insert({ login: "P_Sirois", like: 'A_Chauvet'})
        bdd.collection('like').insert({ login: "J_Bertrand", like: 'A_Chauvet'})
        bdd.collection('like').insert({ login: "E_Douffet", like: 'O_Royer'})
        bdd.collection('like').insert({ login: "O_Royer", like: 'H_Charlebo'})
        bdd.collection('like').insert({ login: "T_Thibault", like: 'H_Charlebo'})
        bdd.collection('like').insert({ login: "V_Charest", like: 'A_Norbert'})
        bdd.collection('like').insert({ login: "R_Dionne", like: 'P_Sirois'})
        bdd.collection('like').insert({ login: "M_Houde", like: 'R_Dionne'})
        bdd.collection('like').insert({ login: "J_Bertrand", like: 'D_Chnadonn'})
        bdd.collection('like').insert({ login: "E_Douffet", like: 'D_Chnadonn'})
        bdd.collection('like').insert({ login: "O_Royer", like: 'A_Barjavel'})
        bdd.collection('like').insert({ login: "T_Thibault", like: 'A_Barjavel'})
        bdd.collection('like').insert({ login: "D_Chnadonn", like: 'A_Barjavel'})

        res.send('Ok')
    }
    else
    res.send('Bdd deja presente')
}
