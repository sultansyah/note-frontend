const tokenUser = localStorage.getItem("token")

export let notes = []

export async function getNotes() {
    const response = await fetch("http://localhost:8080/api/v1/notes", {
        headers: { Authorization: `Bearer ${tokenUser}` }
    })
    return response
}

export async function init() {
    const response = await getNotes()
    const data = await response.json()
    notes = data.data
}

function getPriorityBadgeClass(priority) {
    switch(priority.toLowerCase()) {
        case 'high': return 'bg-danger';
        case 'medium': return 'bg-warning text-dark';
        case 'low': return 'bg-success';
        default: return 'bg-secondary';
    }
}

function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'completed': return 'bg-success';
        case 'in progress': return 'bg-info text-dark';
        case 'pending': return 'bg-warning text-dark';
        default: return 'bg-secondary';
    }
}

export function setNotes() {
    const notesContainer = document.getElementById("notes-container")
    notesContainer.className = "row g-4"
    
    notes.forEach((item, index) => {
        const cardDiv = document.createElement("div")
        cardDiv.id = item.id
        cardDiv.className = 'col-md-6 col-lg-4'
        
        const cardInner = document.createElement("div")
        cardInner.className = 'card h-100 shadow-sm'
        
        const cardHeader = document.createElement("div")
        cardHeader.className = 'card-header d-flex justify-content-between align-items-center'
        
        const titleSpan = document.createElement("h5")
        titleSpan.className = 'card-title mb-0 text-light'
        titleSpan.textContent = `Note ${index + 1}`
        
        const badgesDiv = document.createElement("div")
        const priorityBadge = document.createElement("span")
        priorityBadge.className = `badge ${getPriorityBadgeClass(item.priority)} me-2`
        priorityBadge.textContent = item.priority
        
        const statusBadge = document.createElement("span")
        statusBadge.className = `badge ${getStatusBadgeClass(item.status)}`
        statusBadge.textContent = item.status
        
        badgesDiv.appendChild(priorityBadge)
        badgesDiv.appendChild(statusBadge)
        cardHeader.appendChild(titleSpan)
        cardHeader.appendChild(badgesDiv)
        
        const cardBody = document.createElement("div")
        cardBody.className = 'card-body'
        
        const categoryEle = document.createElement("div")
        categoryEle.className = 'mb-3'
        categoryEle.innerHTML = `<small class="text-muted">Category</small><div class="text-light">${item.category}</div>`
        
        const noteEle = document.createElement("div")
        noteEle.className = 'mb-3'
        noteEle.innerHTML = `<small class="text-muted">Note</small><div class="text-light">${item.note}</div>`
        
        const tagsEle = document.createElement("div")
        tagsEle.className = 'mb-3'
        const tagsArray = item.tags.split(',').map(tag => tag.trim())
        const tagsHtml = tagsArray.map(tag => 
            `<span class="badge bg-secondary text-light me-1">${tag}</span>`
        ).join('')
        tagsEle.innerHTML = `<small class="text-muted">Tags</small><div class="mt-1">${tagsHtml}</div>`

        const cardFooter = document.createElement("div")
        cardFooter.className = 'card-footer'
        const datesDiv = document.createElement("div")
        datesDiv.className = 'small text-muted'
        datesDiv.innerHTML = `
            <div>Created: ${new Date(item.created_at).toLocaleDateString()}</div>
            <div>Updated: ${new Date(item.updated_at).toLocaleDateString()}</div>
        `
        cardFooter.appendChild(datesDiv)

        const editDeleteDiv = document.createElement("div")
        editDeleteDiv.className = 'small text-muted'
        editDeleteDiv.innerHTML = `
            <button id="edit" value="${item.id}" class="btn btn-success mt-2 mr-2">Edit</button>
            <button id="delete" value="${item.id}" class="btn btn-danger mt-2 ml-2">Delete</button>
        `
        cardFooter.appendChild(editDeleteDiv)

        cardBody.appendChild(categoryEle)
        cardBody.appendChild(noteEle)
        cardBody.appendChild(tagsEle)
        
        cardInner.appendChild(cardHeader)
        cardInner.appendChild(cardBody)
        cardInner.appendChild(cardFooter)
        cardDiv.appendChild(cardInner)
        notesContainer.appendChild(cardDiv)
    })
}

export async function add(data) {
    const response = await fetch("http://localhost:8080/api/v1/notes", {
        headers: { Authorization: `Bearer ${tokenUser}` },
        body: JSON.stringify(data),
        method: "POST"
    })
    return response
}

export async function edit(id, data) {
    const response = await fetch(`http://localhost:8080/api/v1/notes/${id}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
        body: JSON.stringify(data),
        method: "PUT"
    })
    return response
}

export async function remove(id) {
    const response = await fetch(`http://localhost:8080/api/v1/notes/${id}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
        method: "DELETE"
    })
    return response
}