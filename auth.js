const register = async (data) => {
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        body: JSON.stringify(data),
        method: "POST"
    })

    return response
}

const login = async (data) => {
    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        body: JSON.stringify(data),
        method: "POST"
    })

    return response
}

const logout = () => {
    localStorage.clear()
    window.location.href = './index.html'
}

const isUserNotLogin = () => {
    const token = localStorage.getItem("token")
    if (!token) {
        alert("user not login")
        logout()
    }
}

const isUserLogin = () => {
    const token = localStorage.getItem("token")
    if (token) {
        alert("user already login")
        window.location.href = './note.html'
    }
}

const setUserData = (data) => {
    localStorage.setItem("name", data.data.name)
    localStorage.setItem("role", data.data.role)
    localStorage.setItem("token", data.data.token)
}

export { register, login, logout, isUserNotLogin, isUserLogin, setUserData }