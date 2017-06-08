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

function save_pass() {
    pass_check();
    pass_confirm_check();

    let pass = document.getElementById('pass');
    let pass_confirm = document.getElementById('pass_confirm');
    let formData = new FormData();
    formData.append("login", pass_login);
    formData.append("key", pass_key);
    formData.append("pass", pass.value);
    formData.append("pass_confirm", pass_confirm.value);

    let request = new XMLHttpRequest();
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok')
            document.getElementById('div_main').innerHTML = '<center>Mot de passe changer, vous pouvez vous connecter</center>'
        }
    }
    request.open("POST", "/new_pass");
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
