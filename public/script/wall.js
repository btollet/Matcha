let tag_list = new Array()

function draw_table() {
    let result = ''

    users.forEach((val) => {
        if (check_draw(val)) {
            let pic = 'default.jpg'
            if (val[1].pic)
            pic = val[1].pic

            result += `
            <tr>
            <th style="vertical-align:middle; text-align:center">
            <img src='picture/${pic}' style=' width: 100%; max-width: 200px;'>
            </th>
            <th style="vertical-align:middle; text-align:center">${val[0]}</br>${val[1].gender}</th>
            <th style="vertical-align:middle; text-align:center">${val[1].age}</th>
            <th style="vertical-align:middle; text-align:center">${val[1].count}</th>
            <th style="vertical-align:middle; text-align:center">${val[1].score}</th>
            <th style="vertical-align:middle; text-align:center"><a href='account?login=${val[0]}'>Voir profil</a></th>
            </tr>`
        }
    })
    document.getElementById('table').innerHTML = result
}

function check_draw(user) {
    let age_min = document.getElementById('age_min').value
    let age_max = document.getElementById('age_max').value
    let tag_min = document.getElementById('tag_min').value
    let score_min = document.getElementById('score_min').value
    let score_max = document.getElementById('score_max').value

    if (parseInt(user[1].age) >= age_min && parseInt(user[1].age) <= age_max) {
        if (parseInt(user[1].count) >= tag_min) {
            if (parseInt(user[1].score) >= score_min && parseInt(user[1].score) <= score_max)
            return(true)
        }
    }
    return(false)
}

function search() {
    let formData = new FormData()
    formData.append("man", document.getElementById('man').checked)
    formData.append("woman", document.getElementById('woman').checked)
    formData.append("hetero", document.getElementById('hetero').checked)
    formData.append("gay", document.getElementById('gay').checked)
    formData.append("bi", document.getElementById('bi').checked)
    formData.append("age_min", document.getElementById('s_age_min').value)
    formData.append("age_max", document.getElementById('s_age_max').value)
    formData.append("score_min", document.getElementById('s_score_min').value)
    formData.append("score_max", document.getElementById('s_score_max').value)
    formData.append("dis", document.getElementById('s_dis').value)
    formData.append("tags", JSON.stringify(tag_list))

    let request = new XMLHttpRequest()
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) {
            let rep = request.responseText
            if (rep) {
                users = JSON.parse(rep)
                document.getElementById('search').click()
                sort()
                draw_table()
            }
        }
    }
    request.open('POST', '/search')
    request.send(formData)
}

function sort() {
    let sort_by = document.getElementById('sort').value
    let sens = document.getElementById('sens').value

    if (sort_by === 'Age') {
        if (sens === 'Croissant')
        users.sort((a, b) => a[1].age - b[1].age)
        else
        users.sort((a, b) => b[1].age - a[1].age)
    }
    /*
    else if (sort_by === 'Distance') {
    if (sens === 'Croissant')
    users.sort((a, b) => a[1].age - b[1].count)
    else
    users.sort((a, b) => b[1].age - a[1].count)

    */
    else if (sort_by === 'Score') {
        if (sens === 'Croissant')
        users.sort((a, b) => a[1].score - b[1].score)
        else
        users.sort((a, b) => b[1].score - a[1].score)
    }
    else if (sort_by === 'Tag en commun') {
        if (sens === 'Croissant')
        users.sort((a, b) => a[1].count - b[1].count)
        else
        users.sort((a, b) => b[1].count - a[1].count)
    }

    draw_table()
}


function sucess(err_mes) {
    document.getElementById('add_tag').setAttribute('class', 'form-control')
    document.getElementById('add_tag_div').setAttribute('class', 'form-group has-success')
    document.getElementById('add_tag_err').setAttribute('hidden', 'hidden')
    err_mes.setAttribute('hidden', 'hidden')
}

function danger(err_mes) {
    document.getElementById('add_tag').setAttribute('class', 'form-control')
    document.getElementById('add_tag_div').setAttribute('class', 'form-group has-danger')
    document.getElementById('add_tag_err').removeAttribute('hidden')
    err_mes.removeAttribute('hidden')
}

function add_tag() {
    let tag = document.getElementById('add_tag')
    let err = document.getElementById('add_tag_err')
    let err_mes = document.getElementById('add_tag_err_mes')
    let my_tag = document.getElementById('my_tag')
    let my_tag_dis = document.getElementById('my_tag_dis')
    let regex = /^#([a-zA-Z0-9]{1,20})$/

    if (regex.test(tag.value)) {

        if (!tag_list.includes(tag.value.toLowerCase())) {
            sucess(err_mes)
            if (my_tag_dis.hasAttribute('disabled')) {
                my_tag.remove("Aucun centre d'interet")
                my_tag_dis.removeAttribute('disabled')
            }
            let option = document.createElement("option")
            option.text = tag.value.toLowerCase()
            my_tag.add(option)
            tag_list.push(tag.value.toLowerCase())
        }
        else {
            danger(err_mes)
            err.innerHTML = 'Tag deja present'
            err_mes.setAttribute('hidden', 'hidden')
        }
    }
    else {
        err.innerHTML = 'Erreur dans le tag'
        danger(err_mes)
    }
}

function del_tag() {
    let my_tag = document.getElementById('my_tag')

    if (!my_tag_dis.hasAttribute('disabled')) {
        my_tag.remove(my_tag.selectedIndex)
        tag_list.splice(tag_list.indexOf(my_tag.selectedIndex))
        if (my_tag.length == 0) {
            document.getElementById('my_tag_dis').setAttribute('disabled', '')
            let option = document.createElement("option")
            option.text = "Aucun centre d'interet"
            my_tag.add(option)
        }

    }
}
