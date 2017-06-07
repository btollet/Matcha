let actual_chat
let list_mes = []
let user_info = []

function draw_table() {
    let result = ''

    users.forEach((val) => {
        let pic = 'default.jpg'
        if (val[1].pic)
        pic = val[1].pic

        result += `
        <li class="nav-item">
            <span id="${val[0]}" class="nav-link" onclick="chat_with('${val[0]}')"><h5>${val[0]}</h5></span>
        </li>`

        user_info[val[0]] = { pic: pic, gender: val[1].gender, score: val[1].score}
    })
    document.getElementById('table').innerHTML = result
}

function chat_with(login) {
    let info_div = document.getElementById('info')
    document.getElementById('chat').removeAttribute('hidden')

    if (login != actual_chat) {
        if (actual_chat)
        document.getElementById(actual_chat).setAttribute('class', 'nav-link')
        document.getElementById(login).setAttribute('class', 'nav-link active')
        actual_chat = login
        info_div.removeAttribute('hidden')
        info_div.innerHTML =
        `<h3 class="card-header">${login}</h3>
            <div class="card-block">
                <center>
                    <img src='picture/${user_info[login].pic}' height="200" width="200"></br></br>
                    ${login}</br>
                    ${user_info[login].gender}</br>
                    Score: ${user_info[login].score}</br></br>
                    <a href='account?login=${login}'>Profil</a>
                </center>
            </div>`
        load_chat()
    }
}

function send_mes() {
    let input = document.getElementById('new_mes')

    let formData = new FormData()
    formData.append('login', actual_chat)
    formData.append('mes', input.value)

    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'ok') {
                input.value = ''
                load_chat()
            }
        }
    }
    request.open('POST', '/new_mes')
    request.send(formData)
}

function draw_mes() {
    let div = document.getElementById('message')
    let result = ''

    list_mes.forEach((val) => {
        if (val.login === actual_chat) {
            result += `
            <div class="row">
                <div class="col-sm-9">
                    <div class="card card-info mb-3">
                        <div class="card-block">
                            <blockquote class="card-blockquote">
                                ${val.mes}
                            </blockquote>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3"></div>
            </div>`
        }
        else {
            result += `
            <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-9">
                    <div class="card card-outline-info mb-3 text-right">
                        <div class="card-block">
                            <blockquote class="card-blockquote">
                                ${val.mes}
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>`
        }
    })
    div.innerHTML = result
    div.scrollTop = div.scrollHeight
}

function load_chat() {
    let formData = new FormData()
    formData.append('login', actual_chat)
    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            rep = request.responseText
            if (rep) {
                list_mes = JSON.parse(rep)
                draw_mes()
            }
        }
    }
    request.open("POST", "/chat_load")
    request.send(formData)
}

//--- Socket
var chat = io.connect('http://localhost:3000/chat');

chat.on('chat', function(data) {
    if (data == my_login) {
        load_chat()
    }
});
