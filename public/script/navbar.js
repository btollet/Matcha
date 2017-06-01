window.onclick = function(event) {
    if (!event.target.matches('.dropdown-menu') && !event.target.matches('.dropdown-item'))
    drop.setAttribute('class', 'nav-item dropdown');
}

function dropdown() {
    let drop = document.getElementById('drop')
    let num = document.getElementById('notif_num')
    let button = document.getElementById('drop_but')

    drop.setAttribute('class', 'nav-item dropdown show')
    button.setAttribute('class', 'btn btn-secondary dropdown-toggle')
    num.innerHTML = null;
}

function check_notif() {
    let notif_div = document.getElementById('my_notif')
    console.log('ok');

    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            rep = request.responseText;
            console.log('->' + rep)
            if (rep)
            notif_div.innerHTML = rep;
        }
    }
    request.open("POST", "/notif")
    request.send()
}

//--- Socket
var notif = io.connect('http://localhost:3000/notif');

notif.on('messages', function(data) {
    let num = document.getElementById('notif_num')
    let button = document.getElementById('drop_but')

    if (data == my_login) {
        check_notif()
        if (!num.innerHTML)
        num.innerHTML = '1'
        else
        num.innerHTML = parseInt(num.innerHTML) + 1
        button.setAttribute('class', 'btn btn-success dropdown-toggle')
    }
});
