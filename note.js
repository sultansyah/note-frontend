import { isUserNotLogin, logout } from "./auth.js"
import { init, setNotes, getNotes, add, edit, remove, notes } from "./note_func.js"
import { displayError } from "./error.js"

isUserNotLogin()

const logoutButton = document.getElementById("logout")
logoutButton.addEventListener('click', function () {
    logout()
})

const nameUser = localStorage.getItem("name")
const nameId = document.getElementById("name")
nameId.textContent = `Welcome, ${nameUser}`
nameId.className = "display-6 mb-4 text-info"

await init()
setNotes()

const note = document.getElementById("note")
const status = document.getElementById("status")
const priority = document.getElementById("priority")
const category = document.getElementById("category")
const tags = document.getElementById("tags")

function getBodyData() {
    return {
        note: note.value,
        status: status.value,
        priority: priority.value,
        category: category.value,
        tags: tags.value
    }
}

async function afterFetch() {
    notesContainer.innerHTML = ''
    clearData()
    await getNotes()
    await init()
    setNotes()
    attachEditListeners()
    attachDeleteListeners()
}

const buttonFormNote = document.getElementById("button-form-note")
const notesContainer = document.getElementById("notes-container")

let noteId = 0

const formNote = document.getElementById("formNote")
formNote.addEventListener('submit', async function (e) {
    e.preventDefault()

    try {
        const body = getBodyData()
        let response = null

        switch (buttonFormNote.value) {
            case "add":
                response = await add(body)
                break;
            case "edit":
                if (noteId == 0) {
                    throw new Error("An unexpected error occurred")
                }
                response = await edit(noteId, body)
                break;
            case "delete":
                if (noteId == 0) {
                    throw new Error("An unexpected error occurred")
                }
                response = await remove(noteId, body)
                break;
            default:
                throw new Error("An unexpected error occurred")
        }

        const data = await response.json()

        if (!response.ok || response == null) {
            displayError(data)
            return
        }

        await afterFetch()

        alert(`success to ${buttonFormNote.value}`)
    } catch (error) {
        displayError(`failed to ${buttonFormNote.value} = ${error.message}`)
    }
})

function clearData() {
    note.value = ''
    status.value = ''
    priority.value = ''
    category.value = ''
    tags.value = ''

    formNote.hidden = true
}

function setData(data) {
    note.value = data.note
    status.value = data.status
    priority.value = data.priority
    category.value = data.category
    tags.value = data.tags
}

const addButton = document.getElementById("add")
addButton.addEventListener('click', function () {
    clearData()

    if (formNote.hidden == true) {
        formNote.hidden = false
    }

    buttonFormNote.value = 'add'
    buttonFormNote.textContent = 'Add'
})

function attachEditListeners() {
    const editButtons = document.querySelectorAll("#edit");
    editButtons.forEach(element => {
        element.addEventListener('click', function (e) {
            clearData();
            if (formNote.hidden == true) {
                formNote.hidden = false;
            }
            formNote.scrollIntoView({ behavior: 'smooth' });

            buttonFormNote.value = 'edit';
            buttonFormNote.textContent = 'Edit';

            noteId = e.target.value;

            const noteItem = notes.find(item => item.id == noteId);
            setData({
                note: noteItem.note,
                status: noteItem.status,
                priority: noteItem.priority,
                category: noteItem.category,
                tags: noteItem.tags
            });
        });
    });
}
attachEditListeners();

const buttonYesDelete = document.getElementById("button-yes-delete")
const buttonNoDelete = document.getElementById("button-no-delete")
const formDeleteNote = document.getElementById("formDeleteNote")

buttonYesDelete.addEventListener('click', async function (e) {
    e.preventDefault()
    formDeleteNote.hidden = true

    try {
        const response = await remove(noteId)
        const data = await response.json()

        if (!response.ok) {
            displayError(data)
            return
        }

        alert("success to delete note")
    } catch (error) {
        displayError("failed to delete = " + error.message)
    }

    await afterFetch()
})

buttonNoDelete.addEventListener('click', async function (e) {
    e.preventDefault()
    formDeleteNote.hidden = true

    await afterFetch()
})

function attachDeleteListeners() {
    const deleteButton = document.querySelectorAll("#delete")
    deleteButton.forEach(element => {
        element.addEventListener('click', function (e) {
            clearData()
            formNote.hidden = true

            formDeleteNote.hidden = false
            formDeleteNote.scrollIntoView({
                behavior: 'smooth'
            });

            formNote.scrollIntoView({
                behavior: 'smooth'
            });

            noteId = e.target.value
        })
    })
}

attachDeleteListeners()