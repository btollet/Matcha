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

function register() {
    check_all();
    window.scrollTo(0, 0);
    let formData = new FormData();
    formData.append("login", document.getElementById('login').value);
    formData.append("pass", document.getElementById('pass').value);
    formData.append("pass_confirm", document.getElementById('pass_confirm').value);
    formData.append("mail", document.getElementById('mail').value);
    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok')
            document.getElementById('main_div').innerHTML = '<center>Votre compte est creer<br/>Vous pouvez maintenant vous connecter</center>';
        }
    }
    request.open("POST", "/register");
    request.send(formData);
}

function skip() {
    alert('/!\\ Il est conseiller de remplir ce formulaire affin de trouver les personnes qui vous correspondent \n- Si vous ne souhaiter pas remplir le formulaire tout de suite vous serez considerez comme Bisexuelle\n- Si vous avez deja entrer des tags ils seront quand meme enregistrer\n\nSouhaiter vous continuer sans remplir le formulaire?');
}

function add_tag() {
    let tag = document.getElementById('add_tag');
    let div = document.getElementById('add_tag_div');
    let err = document.getElementById('add_tag_err');
    let err_mes = document.getElementById('add_tag_err_mes');
    let my_tag = document.getElementById('my_tag');
    let my_tag_dis = document.getElementById('my_tag_dis');
    let regex = /^#([a-z0-9]{1,20})$/;

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
                    option.text = tag.value;
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

function picture() {
    let formData = new FormData();
    formData.append("test", document.getElementById('picture').files[0]);

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
