function draw_table() {
    let result = ''

    users.forEach((val) => {
        let pic = 'default.jpg'
        if (val[1].pic)
        pic = val[1].pic

        result += `
        <div class="card">
            <div class="card-header" role="tab" data-toggle="collapse" data-parent="#accordion" href="#${val[0]}" aria-expanded="true" aria-controls="collapseOne">
                <h5 class="mb-0">
                        ${val[0]}
                </h5>
            </div>
            <div id="${val[0]}" class="collapse" role="tabpanel" aria-labelledby="headingOne">
                <div class="card-block">
                    Conversation
                </div>
            </div>
        </div>`
    })
    document.getElementById('table').innerHTML = result
}
