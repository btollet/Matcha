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
