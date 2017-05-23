function sucess(form, div, err, err_mes) {
    form.setAttribute('class', 'form-control form-control-success');
    div.setAttribute('class', 'form-group has-success');
    err.setAttribute('hidden', 'hidden');
    err_mes.setAttribute('hidden', 'hidden');
}

function danger(form, div, err, err_mes) {
    form.setAttribute('class', 'form-control form-control-danger');
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
    document.getElementById('div_tag_mod').removeAttribute('hidden');
    document.getElementById('div_tag').setAttribute('hidden', 'hidden');
    //- Information
    document.getElementById('div_info_mod').removeAttribute('hidden');
    document.getElementById('div_info').setAttribute('hidden', 'hidden');
    document.getElementById('f_name').addEventListener('change', f_name_check);
    document.getElementById('name').addEventListener('change', name_check);
    //- Information privee
    document.getElementById('div_priv').removeAttribute('hidden');
    document.getElementById('br').removeAttribute('hidden');
    //- Boutton fin de page
    document.getElementById('main_button').innerHTML = 'Voir mon profil';
    document.getElementById('main_button').setAttribute('onclick', 'window.location.replace("/account");');
    document.getElementById('main_small').innerHTML = "Enregistrer vos changements avant !";
}

function save_bio() {
    let bio = document.getElementById('bio');
    let formData = new FormData();
    formData.append("bio", bio.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok')
            document.getElementById('bio_ok').removeAttribute('hidden');
        }
    }
    if (bio_count()) {
        request.open("POST", "/save_bio");
        request.send(formData);
    }
}

function save_pass() {
    pass_check();
    pass_confirm_check();

    let old = document.getElementById('old_pass');
    let pass = document.getElementById('pass');
    let pass_confirm = document.getElementById('pass_confirm');
    let formData = new FormData();
    formData.append("old", old.value);
    formData.append("pass", pass.value);
    formData.append("pass_confirm", pass_confirm.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok') {
                document.getElementById('pass_ok').removeAttribute('hidden');
                old.value = '';
                pass.value = '';
                pass_confirm.value = '';
            }
            else if (request.responseText == 'error') {
                document.getElementById('div_old_pass').setAttribute('class', 'form-group has-danger');
                document.getElementById('old_pass_err').removeAttribute('hidden');
                document.getElementById('pass_ok').setAttribute('hidden', 'hidden');
            }
        }
    }
    request.open("POST", "/save_pass");
    request.send(formData);
}

function save_mail() {
    mail_check();

    let mail = document.getElementById('mail');
    let formData = new FormData();
    formData.append("mail", mail.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok')
            document.getElementById('mail_ok').removeAttribute('hidden');
        }
    }
    request.open("POST", "/save_mail");
    request.send(formData);
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
            if (request.responseText == 'ok')
            document.getElementById('info_ok').innerHTML = 'Enregistrer<hr>';
            else
            document.getElementById('info_ok').innerHTML = 'Erreur verifier vos entrez<hr>';
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
                    tag.setAttribute('class', 'form-control form-control-danger');
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

function reset_pass() {
    document.getElementById('div_old_pass').setAttribute('class', 'form-group');
    document.getElementById('old_pass_err').setAttribute('hidden', 'hidden');
    document.getElementById('pass_ok').setAttribute('hidden', 'hidden');
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

function mail_check() {
    let mail = document.getElementById('mail');
    let div = document.getElementById('div_mail');
    let error = document.getElementById('mail_err');
    let error_mes = document.getElementById('mail_err_mes');
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let formData = new FormData();
    formData.append("mail", mail.value);

    document.getElementById('mail_ok').setAttribute('hidden', 'hidden');
    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            let exist = (request.responseText);
            if (regex.test(mail.value) && exist == 'ok') {
                sucess(mail, div, error, error_mes);
                div.setAttribute('class', 'form-group row has-success');
            }
            else
            {
                danger(mail, div, error, error_mes);
                div.setAttribute('class', 'form-group row has-danger');
                if (exist == 'exist') {
                    error.innerHTML = 'Adresse mail deja utilise';
                    error_mes.innerHTML = 'Prenez une adresse mail non associer a un compte deja existant'
                }
                else {
                    error.innerHTML = 'Adresse mail non valide';
                    error_mes.innerHTML = 'Verifez votre adresse mail';
                }
            }
        }
    }
    request.open("POST", "/mail_check");
    request.send(formData);
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
