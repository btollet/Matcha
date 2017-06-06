function draw_table() {
    let result = ''

    users.forEach((val) => {
        let pic = 'default.jpg'
        if (val[1].pic)
        pic = val[1].pic

        result += `
        <tr>
        <th style="vertical-align:middle; text-align:center">
        <img height="200px" width="200px" src='picture/${pic}'>
        </th>
        <th style="vertical-align:middle; text-align:center">${val[0]}</br>${val[1].gender}</th>
        <th style="vertical-align:middle; text-align:center">${val[1].score}</th>
        <th style="vertical-align:middle; text-align:center"></th>
        <th style="vertical-align:middle; text-align:center"><a href='account?login=${val[0]}'>Voir profil</a></th>
        </tr>`
    })
    document.getElementById('table').innerHTML = result
}
