function getAPI() {

    let headersList = {
        "Accept": "*/*",
    }

    fetch("https://jsonplaceholder.typicode.com/todos/", {
        method: "GET",
        headers: headersList
    }).then(function (response) {
        return response.text()
    }).then((data) => JSON.parse(data))
        .then((data) => {
            for (let item in data) {

                let opacity
                let checked
                let date = new Date();

                if (data[item].completed === true) {
                    opacity = `style="opacity:0.37;"`
                    checked = `checked=true`
                }

                document.querySelector('tbody').innerHTML += `

        <tr data-index="${data[item].id}" ${opacity}>
        <td class="descricao">${data[item].title.substring(0, 30) + '...'}</td>
        <td class="data-de-adicao">${date.toLocaleDateString()}</td>
        <td class="date">ID ${data[item].id}</td>
        <td class="checkbox-del">
        <img src="./assets/edit.svg" class="editar">
        <input type="checkbox" ${checked} disabled name="checkbox" class="checkbox">
        <img src="./assets/minus.svg" alt="Remover Tarefa">
        </td>
        </tr>
            `
            }
        })
}

getAPI()

