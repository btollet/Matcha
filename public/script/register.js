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

function check_all() {
    login_check();
    pass_check();
    mail_check();
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

function login_check () {
    let login = document.getElementById('login');
    let div = document.getElementById('div_login');
    let error = document.getElementById('login_err');
    let error_mes = document.getElementById('login_err_mes');
    let formData = new FormData();
    formData.append("login", login.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            let exist = (request.responseText);
            if (login.value.length >= 3 && login.value.length <= 10 && exist == 'ok')
            sucess(login, div, error, error_mes);
            else
            {
                login.setAttribute('class', 'form-control form-control-danger');
                div.setAttribute('class', 'form-group has-danger');
                error.removeAttribute('hidden');
                if (exist == 'exist') {
                    error.innerHTML = 'Login non disponible';
                    error_mes.setAttribute('hidden', 'hidden');
                }
                else {
                    error_mes.removeAttribute('hidden');
                    if (login.value.length < 3)
                    error.innerHTML = 'Login trop court';
                    else
                    error.innerHTML = 'Login trop long';
                }
            }
        }
    }
    request.open("POST", "/login_check");
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

function mail_check() {
    let mail = document.getElementById('mail');
    let div = document.getElementById('div_mail');
    let error = document.getElementById('mail_err');
    let error_mes = document.getElementById('mail_err_mes');
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let formData = new FormData();
    formData.append("mail", mail.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            let exist = (request.responseText);
            if (regex.test(mail.value))
            sucess(mail, div, error, error_mes);
            else
            {
                mail.setAttribute('class', 'form-control form-control-danger');
                div.setAttribute('class', 'form-group has-danger');
                error.removeAttribute('hidden');
                error_mes.removeAttribute('hidden');
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
