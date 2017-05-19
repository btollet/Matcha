function sucess(form, div, err, err_mes) {
    form.setAttribute('class', 'form-control form-control-success mb-2 mr-sm-2 mb-sm-0');
    div.setAttribute('class', 'form-group has-success');
    err.setAttribute('hidden', 'hidden');
    err_mes.setAttribute('hidden', 'hidden');
}

function danger(form, div, err, err_mes) {
    form.setAttribute('class', 'form-control form-control-danger mb-2 mr-sm-2 mb-sm-0');
    div.setAttribute('class', 'form-group has-danger');
    err.removeAttribute('hidden');
    err_mes.removeAttribute('hidden');
}

function modif() {
    //- Biographie
    document.getElementById('div_bio').innerHTML = div_bio();
    bio_count();
    document.getElementById('bio_div').setAttribute('class', 'form-group');
    document.getElementById('bio').onkeyup = bio_count;
    //- Photo profil
    document.getElementById('div_pic').innerHTML = div_pic();
    document.getElementById('picture').addEventListener('change', picture);
    //- Tag
    document.getElementById('div_tag').innerHTML = div_tag();
    //- Information
    document.getElementById('div_info').innerHTML = div_info();
    document.getElementById('f_name').addEventListener('change', f_name_check);
    document.getElementById('name').addEventListener('change', name_check);
    //- Information privee
    document.getElementById('div_priv').removeAttribute('hidden');
    document.getElementById('br').removeAttribute('hidden');
    //- Boutton fin de page
    document.getElementById('main_button').innerHTML = 'Tout enregistrer';
    document.getElementById('main_button').setAttribute('onclick', 'save_all()');
    document.getElementById('main_small').innerHTML = "Les images et tags sont enregistrer automatiquement<br/>Ne prend pas en compte le changement de mot de passe";
}

function save_all() {
    let valid = true;
    if (!save_info()) {console.log('Info');
        valid = false;}
    if (!save_bio()) {console.log('Bio');
        valid = false;}
    console.log(valid);
    if (valid)
        window.location.replace('/account');
}

function save_bio() {
    let bio = document.getElementById('bio');
    let formData = new FormData();
    formData.append("bio", bio.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok') {
                document.getElementById('bio_ok').removeAttribute('hidden');
                return (true);
            }
            else
            return (false);
        }
    }
    if (bio_count()) {
        request.open("POST", "/save_bio");
        request.send(formData);
    }
    else
    return (false);
}

function save_info() {
    let formData = new FormData();
    formData.append("f_name", document.getElementById('f_name').value);
    formData.append("name", document.getElementById('name').value);
    formData.append("gender", document.getElementById('gender').value);
    formData.append("age", document.getElementById('age').value);
    formData.append("orientation", document.getElementById('orientation').value);
    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            document.getElementById('info_ok').removeAttribute('hidden');
            if (request.responseText == 'ok') {
                document.getElementById('info_ok').innerHTML = 'Enregistrer<hr>';
                return (true);
            }
            else {
                document.getElementById('info_ok').innerHTML = 'Erreur verifier vos entrez<hr>';
                return (false);
            }
        }
    }
    request.open("POST", "/save_info");
    request.send(formData);
}

function bio_count () {
    let count = document.getElementById('bio_count');
    let div = document.getElementById('bio_div');
    let bio = document.getElementById('bio');
    let bio_err = document.getElementById('bio_err');
    let regex = /^[a-zA-Z0-9 \n\r]*$/;

    document.getElementById('bio_ok').setAttribute('hidden', 'hidden');
    count.innerHTML = 500 - bio.value.length;
    if (regex.test(bio.value)) {
        div.setAttribute('class', 'form-group has-success');
        bio_err.setAttribute('hidden', 'hidden');
        return (true);
    }
    else {
        bio_err.removeAttribute('hidden');
        div.setAttribute('class', 'form-group has-danger');
        return (false);
    }
}

function picture() {
    let formData = new FormData();
    formData.append("file", document.getElementById('picture').files[0]);
    formData.append("picture", 'profil');

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText) {
                document.getElementById('picture_preview').setAttribute('src', 'picture/' + request.responseText )
            }
        }
    }
    request.open("POST", "/picture");
    request.send(formData);
}

function add_tag() {
    let tag = document.getElementById('add_tag');
    let div = document.getElementById('add_tag_div');
    let err = document.getElementById('add_tag_err');
    let err_mes = document.getElementById('add_tag_err_mes');
    let my_tag = document.getElementById('my_tag');
    let my_tag_dis = document.getElementById('my_tag_dis');
    let regex = /^#([a-zA-Z0-9]{1,20})$/;

    if (regex.test(tag.value)) {
        let formData = new FormData();
        formData.append("tag", tag.value);

        let request = new XMLHttpRequest();
        request.onload = () => {
            if (request.readyState == 4 && request.status == 200) {
                if (request.responseText == 'ok') {
                    sucess(tag, div, err, err_mes);
                    if (my_tag_dis.hasAttribute('disabled')) {
                        my_tag.remove("Aucun centre d'interet");
                        my_tag_dis.removeAttribute('disabled');
                    }
                    let option = document.createElement("option");
                    option.text = tag.value.toLowerCase();
                    my_tag.add(option);
                }
                else {
                    tag.setAttribute('class', 'form-control form-control-danger mb-2 mr-sm-2 mb-sm-0');
                    div.setAttribute('class', 'form-group has-danger');
                    err.removeAttribute('hidden');
                    err.innerHTML = 'Vous utilisez deja ce tag';
                    err_mes.setAttribute('hidden', 'hidden');
                }
            }
        }
        request.open("POST", "/add_tag");
        request.send(formData);
    }
    else {
        err.innerHTML = 'Erreur dans le tag';
        danger(tag, div, err, err_mes);
    }
}

function del_tag() {
    let my_tag = document.getElementById('my_tag');

    if (!my_tag_dis.hasAttribute('disabled')) {
        let formData = new FormData();
        formData.append("tag", my_tag.value);

        let request = new XMLHttpRequest();
        request.onload = () => {
            if (request.readyState == 4 && request.status == 200) {
                if (request.responseText == 'ok') {
                    my_tag.remove(my_tag.selectedIndex);
                    if (my_tag.length == 0) {
                        document.getElementById('my_tag_dis').setAttribute('disabled', '');
                        let option = document.createElement("option");
                        option.text = "Aucun centre d'interet";
                        my_tag.add(option);
                    }
                }
            }
        }
        request.open("POST", "/del_tag");
        request.send(formData);
    }
}

function f_name_check () {
    let f_name = document.getElementById('f_name');
    let div = document.getElementById('div_f_name');
    let error = document.getElementById('f_name_err');
    let error_mes = document.getElementById('f_name_err_mes');
    let regex = /^[a-zA-Z ]+$/;

    if (f_name.value.length > 20) {
        error.innerHTML = 'Limiter a 20 characteres';
        error_mes.innerHTML = '';
        danger(f_name, div, error, error_mes);
    }
    else
    {
        if (regex.test(f_name.value))
        sucess(f_name, div, error, error_mes);
        else {
            error.innerHTML = 'Nom invalide';
            error_mes.innerHTML = 'Seul les lettres et les espaes sont autorise';
            danger(f_name, div, error, error_mes);
        }
    }
}

function name_check () {
    let name = document.getElementById('name');
    let div = document.getElementById('div_name');
    let error = document.getElementById('name_err');
    let error_mes = document.getElementById('name_err_mes');
    let regex = /^[a-zA-Z ]+$/;

    if (name.value.length > 20) {
        error.innerHTML = 'Limiter a 20 characteres';
        error_mes.innerHTML = '';
        danger(name, div, error, error_mes);
    }
    else
    {
        if (regex.test(name.value))
        sucess(name, div, error, error_mes);
        else {
            error.innerHTML = 'Prenom invalide';
            error_mes.innerHTML = 'Seul les lettres et les espaes sont autorise';
            danger(name, div, error, error_mes);
        }
    }
}

function pass_check() {
    let pass = document.getElementById('pass');
    let pass_confirm = document.getElementById('pass_confirm');
    let div = document.getElementById('div_pass');
    let error = document.getElementById('pass_err');
    let error_mes = document.getElementById('pass_err_mes');
    let regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

    if (regex.test(pass.value))
    sucess(pass, div, error, error_mes);
    else
    danger(pass, div, error, error_mes);
    pass_confirm_check();
}

function pass_confirm_check() {
    let pass = document.getElementById('pass');
    let pass_confirm = document.getElementById('pass_confirm');
    let div = document.getElementById('div_pass_confirm');
    let error = document.getElementById('pass_confirm_err');
    let error_mes = document.getElementById('pass_confirm_err_mes');

    if (pass.value == pass_confirm.value)
    sucess(pass_confirm, div, error, error_mes);
    else
    danger(pass_confirm, div, error, error_mes);
}

//--- HTML
function div_bio() {
    let div = '<div id="bio_div" class="form-group">';
    let message = '<label id="bio_ok" hidden>Enregistrer<hr></label>';
    let textarea = '<textarea class="form-control" id="bio" rows="3" >' + user.bio +'</textarea>';
    let counter = '<div class="row"><div class="col-10"></div><div class="col-2"><small class="form-text text-muted">Restant: <span id="bio_count">500</span></small></div></div>';
    let err = '<div id="bio_err" class="form-control-feedback" hidden="hidden">Caracteres speciaux interdit</div>';
    let button = '<button type="button" class="btn btn-primary" onclick="save_bio()">Enregistrer</button></div>';
    return (div + message + textarea + counter + err + button);
}

function div_pic () {
    let button = '<input type="file" class="form-control-file" id="picture" aria-describedby="fileHelp">';
    return (button);
}

function div_tag() {
    let add_div = '<div id="add_tag_div" class="form-group"><div class="form-inline">';
    let add_input = '<input type="text" class="form-control mb-2 mr-sm-2 mb-sm-0" id="add_tag" placeholder="#bg" maxlength="21">';
    let add_submit = '<button type="submit" class="btn btn-primary mb-2 mr-sm-2 mb-sm-0" onclick="add_tag()">Ajouter</button></div>';
    let small = '<small class="form-text text-muted">Tag sans espace(ex: #bio, #geek, #piercing)</small>';
    let err = '<div id="add_tag_err" class="form-control-feedback" hidden="hidden">Erreur dans le tag</div>';
    let err_mes = '<small id="add_tag_err_mes" class="form-text text-muted" hidden="hidden">Votre tag doit:<br/>- Commencer pas un #<br/>- Contenir uniquement des lettres et chiffres<br/>- Posseder entre 1 et 20 caracteres (# non compris)</small>';
    let rem_div = '</div><hr><div class="form-group"><div class="form-inline">';
    let fieldset = '<fieldset id="my_tag_dis"';
    if (!tag[0])
    fieldset += ' disabled';
    let select = '><select class="form-control mb-2 mr-sm-2 mb-sm-0" id="my_tag">'
    let option;
    if (!tag[0])
    option = "<option>Aucun centre d'interet</option>";
    else {
        tag.forEach((val) => {
            option += '<option>' + val.tag + '</option>';
        });
    }
    let rem_submit = '</select></fieldset><button type="submit" class="btn btn-primary" onclick="del_tag()">Retirer</button></div></div>';
    return (add_div + add_input + add_submit + small + err + err_mes + rem_div + fieldset + select + option + rem_submit);
}

function div_info() {
    let message = '<label id="info_ok" hidden>Enregistrer<hr></label>';
    let f_name = '<div id="div_f_name" class="form-group"><label>Nom</label><input type="text" class="form-control" id="f_name" value="' + user.f_name + '" placeholder="Nom" maxlength="20"><div id="f_name_err" class="form-control-feedback" hidden="hidden"></div>';
    let f_name_small = '<small id="f_name_err_mes" class="form-text text-muted" hidden="hidden"></small></div>';
    let name = '<div id="div_name" class="form-group"><label>Prenom</label><input type="text" class="form-control" id="name" value="' + user.name + '" placeholder="Prenom" maxlength="20"><div id="name_err" class="form-control-feedback" hidden="hidden"></div>';
    let name_small = '<small id="name_err_mes" class="form-text text-muted" hidden="hidden"></small></div>';
    let sexe = '<div class="form-group"><label>Sexe</label><select class="form-control" id="gender"><option ';
    if (user.gender === '♂ Homme')
    sexe += 'selected="selected"';
    sexe += '>♂ Homme</option><option ';
    if (user.gender === '♀ Femme')
    sexe += 'selected="selected"';
    sexe += '>♀ Femme</option></select></div>';
    let age = '<div class="form-group"><label>Age</label><input class="form-control" type="number" value="' + user.age + '" min="16" max="120" id="age"></div>';
    let orient = '<div class="form-group"><label>Orientation</label><select class="form-control" id="orientation"><option ';
    if (user.orientation === 'Heterosexuel')
    orient += 'selected="selected"';
    orient += '>Heterosexuel</option><option ';
    if (user.orientation === 'Gay / Lesbienne')
    orient += 'selected="selected"';
    orient += '>Gay / Lesbienne</option><option ';
    if (user.orientation === 'Bisexuel')
    orient += 'selected="selected"';
    orient += '>Bisexuel</option></select></div>';
    let button = '<button type="button" class="btn btn-primary" onclick="save_info()">Enregistrer</button></div>';
    return (message + f_name + f_name_small + name + name_small + sexe + age + orient + button);
}
