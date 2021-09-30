const Modal = {

    open() {
        document
            .querySelector(".modal-overlay")
            .classList
            .add("active")

    },

    close() {
        document
            .querySelector(".modal-overlay")
            .classList
            .remove("active")
        document
            .querySelector("div#form >h2")
            .innerText = 'Nova Tarefa'

        Form.limparCampos()
    }
}

const Storage = {
    get() {
        let items = localStorage.getItem('minhastarefas') ? JSON.parse(localStorage.getItem('minhastarefas')) : []

        return items
    },
    set(tarefas) {
        localStorage.setItem("minhastarefas", JSON.stringify(tarefas))
    },
}

const Tarefa = {
    all: Storage.get(),

    add(tarefa) {
        Tarefa.all.push(tarefa)

        App.reload()
        editarTarefa()
    },

    remove(index) {
        let excluir = confirm('Tem certeza que deseja excluir esta tarefa?')

        if (excluir) {

            Tarefa.all.splice(index, 1)

            App.reload()
        }
    }
}

const DOM = {

    tarefasContainer: document.querySelector('#data-table tbody'),

    addTarefa(tarefa, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTarefa(tarefa, index)
        tr.dataset.index = index

        DOM.tarefasContainer.appendChild(tr)
    },

    innerHTMLTarefa(tarefa, index) {

        let date = new Date();

        const html = `
            <td class="descricao">${tarefa.descricao.substring(0, 30) + '...'}</td>
            <td class="data-de-adicao">${date.toLocaleDateString()}</td>
            <td class ="date">${tarefa.date}</td>
            <td class="checkbox-del">
            <img src="./assets/edit.svg" class="editar">
              <input type="checkbox" name="checkbox" class="checkbox">
              <img onclick="Tarefa.remove(${index})" src="./assets/minus.svg" alt="Remover Tarefa">
            </td>
                    `
        return html;
    },

    limparTarefas() {
        DOM.tarefasContainer.innerHTML = ""
    }


}

const Utils = {

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    convertDate(date) {
        const splittedDate = date.split("/")
        const data = new Date(`${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`)

        return data
    }
}

const Form = {
    descricao: document.querySelector('input#descricao'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            descricao: Form.descricao.value,
            date: Form.date.value,
            completed: false
        }
    },

    validateFields() {
        const { descricao, date } = Form.getValues()

        if (descricao.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos.")
        } else if (descricao.length < 10) {
            throw new Error("Por favor, coloque mais de 10 caracteres na descrição da tarefa.")
        }
    },

    formatValues() {
        let { descricao, date, completed } = Form.getValues()

        date = Utils.formatDate(date)

        return {
            descricao,
            date,
            completed
        }
    },

    limparCampos() {
        Form.descricao.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const tarefa = Form.formatValues()
            Tarefa.add(tarefa)
            Form.limparCampos()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init() {

        Tarefa.all.forEach(DOM.addTarefa)

        Storage.set(Tarefa.all)

    },

    reload() {
        DOM.limparTarefas()
        App.init()
        tarefaConcluida()
    }
}

App.init()

function tarefaConcluida() {
    const checkbox = document.querySelectorAll('.checkbox')
    const tr = document.querySelectorAll('tbody > tr')

    for (let i = 0; i < checkbox.length; i++) {

        checkbox[i].addEventListener('change', function () {

            if (this.checked) {
                tr[i].style.opacity = 0.27

                let checked = Storage.get('minhastarefas')[i]
                checked.completed = true

                let all = Storage.get('minhastarefas')
                all[i] = checked

                Storage.set(all)

            } else {
                tr[i].style.opacity = 0.7

                let checked = Storage.get('minhastarefas')[i]
                checked.completed = false

                let all = Storage.get('minhastarefas')
                all[i] = checked

                Storage.set(all)
            }
        })

        if (Storage.get('minhastarefas')[i].completed === true) {
            tr[i].style.opacity = 0.27
            checkbox[i].checked = true
        }
    }
}
tarefaConcluida()

function editarTarefa() {
    const editar = document.querySelectorAll('.editar')

    let item = 0
    let clicked = false

    for (let i = 0; i < editar.length; i++) {
        let descricao = Storage.get('minhastarefas')[i].descricao
        let data = Utils.convertDate(Storage.get('minhastarefas')[i].date)

        editar[i].addEventListener('click', () => {
            document.querySelector('div#form > h2').innerText = 'Atualizar Tarefa'
            document.querySelector('.input-group #descricao').value = descricao
            document.querySelector('.input-group #date').valueAsDate = data;

            item = i
            clicked = true

            if (clicked) {

                Modal.open()

                document.querySelector("button").addEventListener("click", (e) => {

                    e.preventDefault()

                    let newEdit = Storage.get('minhastarefas')[item]

                    newEdit.descricao = document.querySelector('.input-group #descricao').value
                    newEdit.date = Utils.formatDate(document.querySelector('.input-group #date').value)

                    let edited = Storage.get('minhastarefas')
                    edited[item] = newEdit
                    Storage.set(edited)


                    document.querySelector('form').setAttribute('onsubmit', 'Form.submit(event)')
                    document.querySelectorAll('.descricao')[item].innerText = newEdit.descricao
                    document.querySelectorAll('.date')[item].innerText = newEdit.date


                    clicked = false
                    Modal.close()
                })
            }
        })
    }
}
editarTarefa()

