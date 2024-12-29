import { login, register, setUserData } from "./auth.js"
import { displayError } from "./error.js"

const formLogin = document.getElementById("login")
const formRegister = document.getElementById("register")

formLogin.addEventListener('submit', async function (e) {
    e.preventDefault()

    try {

        const email = document.getElementById("email")
        const password = document.getElementById("password")

        const body = {
            email: email.value,
            password: password.value
        }

        const response = await login(body)
        const data = await response.json()

        if (!response.ok) {
            displayError(data)
            return
        }

        alert(data.message)
        setUserData(data)
        window.location.href = './note.html'
    } catch (error) {
        displayError("failed to login = " + error.message)
    }
})

formRegister.addEventListener('submit', async function (e) {
    e.preventDefault()

    try {
        const name = document.getElementById("name-register")
        const email = document.getElementById("email-register")
        const password = document.getElementById("password-register")

        const body = {
            name: name.value,
            email: email.value,
            password: password.value,
            role: "user"
        }

        const response = await register(body)
        const data = await response.json()

        if (!response.ok) {
            displayError(data)
            return
        }

        alert(data.message)

        setUserData(data)

        window.location.href = './note.html'
    } catch (error) {
        displayError("failed to register = " + error.message)
    }
})