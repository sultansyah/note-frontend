import { logout } from "./auth.js"

export function displayError(data) {
    const errorContainer = document.getElementById("error-container")
    let message = ""

    if (data.code == 422) {
        message = data.data || "An unexpected error occurred"
    } else if (data.code == 401) {
        message = data.message || "An unexpected error occurred"
        alert(message)
        logout()
    } else {
        message = data.message || "An unexpected error occurred"
    }

    if (errorContainer) {
        errorContainer.textContent = message
        errorContainer.style.color = "red"
    } else {
        console.error("container error not found = ", errorContainer)
    }
}