window.onclick = function(event) {
    if (!event.target.matches('.dropdown-menu') && !event.target.matches('.dropdown-item'))
    drop.setAttribute('class', 'nav-item dropdown')
}

function dropdown() {
    let drop = document.getElementById('drop')
    let num = document.getElementById('notif_num')
    let button = document.getElementById('drop_but')

    drop.setAttribute('class', 'nav-item dropdown show')
    button.setAttribute('class', 'btn btn-secondary dropdown-toggle')
    num.innerHTML = null;
    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText === 'ok')
                num.innerHTML = null
        }
    }
    request.open("POST", "/notif_see")
    request.send()
}

function check_notif() {
    let notif_div = document.getElementById('my_notif')
    let num = document.getElementById('notif_num')
    let button = document.getElementById('drop_but')

    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            rep = request.responseText
            if (rep !== 'Aucune notification') {
                let notif_json = JSON.parse(rep)
                let count = 0
                let result = `<img src='icon/trash.png' width='32' height='32' onclick='trash()'>`

                notif_json.forEach((val) => {
                    if (!val.vue)
                    count++
                    result += '<hr>' + val.mes;
                })
                if (count > 0) {
                    num.innerHTML = count
                    button.setAttribute('class', 'btn btn-success dropdown-toggle')
                }
                notif_div.innerHTML = result
            }
            else
            notif_div.innerHTML = 'Aucune notification'
        }
    }
    request.open("POST", "/notif")
    request.send()
}

function trash() {
    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status === 200) {
            if (request.responseText == 'ok')
                document.getElementById('my_notif').innerHTML = 'Aucune notification'
        }
    }
    request.open("POST", "/notif_del")
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
