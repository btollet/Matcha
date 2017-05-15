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
