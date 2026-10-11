const statuses = ["Applied", "Interview", "Offer", "Rejected"]

let applications = loadApplications()
let currentFilter = "All"
let searchTerm = ""


const search = document.getElementById("search")
const container = document.getElementById("applications")
const filterStatus = document.getElementById("filter-status")
const addForm = document.getElementById("add-form")

function createApplicationCard({application, onStatusChange, onDelete}) {
    
    const card = document.createElement("div")
    card.className = "card"

    const badge = document.createElement("span")
    badge.className = `badge badge-${application.status.toLowerCase()}`
    badge.textContent = application.status

    const title = document.createElement("h3")
    title.textContent = application.company

    const details = document.createElement("p")
    details.textContent = `${application.position} - ${application.dateApplied}`

    const notes = document.createElement("p")
    notes.textContent = application.notes

    const select = document.createElement("select")
    select.setAttribute("aria-label", "Change status")
    statuses.forEach((status) => {
        const option = document.createElement("option")
        option.textContent = status
        
        option.selected = status === application.status
        select.append(option)
    })

    select.addEventListener("change", () => {
        onStatusChange(application.id, select.value)
    })

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.addEventListener("click", () => {
        onDelete(application.id)
    })

    card.append(badge)
    card.append(title)
    card.append(details)
    card.append(notes)
    card.append(select)
    card.append(deleteBtn)

    return card
}

function handleStatusChange(id, newStatus) {
    const app = applications.find((application) => {
        return application.id === id
    })

    if (!app) {
        return
    }

    app.status = newStatus;

    saveApplications(applications)

    renderApps()
}

function handleDelete(id) {
    applications = applications.filter((application) => {
        return application.id !== id
    })

    saveApplications(applications)

    renderApps()
}

function updateDashboard() {
    const count = (status) => {
         return applications.filter((application) => {
            return application.status === status
        }).length
    }

    document.getElementById("count-total").textContent = applications.length
    document.getElementById("count-applied").textContent = count("Applied")
    document.getElementById("count-interview").textContent = count("Interview")
    document.getElementById("count-offer").textContent = count("Offer")
    document.getElementById("count-rejection").textContent = count("Rejected")
}

function renderApps() {
    updateDashboard()

    const visible = applications.filter((application) => {
        const matchesStatus = currentFilter === "All" || application.status === currentFilter
        const matchesSearch = application.company.toLowerCase().includes(searchTerm)
        return matchesStatus && matchesSearch
    })

    container.innerHTML = ""

    if (visible.length === 0) {
        const empty = document.createElement("p")
        empty.textContent = applications.length === 0 ? "No applications yet. Add your first one above" : "No applications match your filters"
        container.append(empty)
        return
    }

    visible.forEach((application) => {
        container.append(
            createApplicationCard({
                application,
                onStatusChange: handleStatusChange,
                onDelete: handleDelete
            })
        )
    })
}

addForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const newApplication = {
        id:Date.now(),
        company: document.getElementById("company").value.trim(),
        position: document.getElementById("position").value.trim(),
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value.trim(),
        dateApplied: document.getElementById("dateApplied").value
    }

    applications.push(newApplication)
    saveApplications(applications)

    search.value = ""
    searchTerm = ""

    addForm.reset()
    renderApps()
})

search.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase()
    renderApps()
})

filterStatus.addEventListener("change", (e) => {
    currentFilter = e.target.value
    renderApps()
})

function loadApplications() {
    try {
        const data = JSON.parse(localStorage.getItem("applications"))
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

function saveApplications(apps) {
    localStorage.setItem("applications", JSON.stringify(apps))
}

saveApplications(applications)

renderApps()

function loadEnquiries() {
    try {
        const data = JSON.parse(localStorage.getItem("contactEnquiries"))
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

const contactForm = document.getElementById("contact-form")

contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const firstName = document.getElementById("first-name").value.trim()
    const lastName = document.getElementById("last-name").value.trim()
    const email = document.getElementById("email").value.trim()
    const message = document.getElementById("message").value.trim()

    document.getElementById("error-first-name").textContent = ""
    document.getElementById("error-last-name").textContent = ""
    document.getElementById("error-message").textContent = ""
    document.getElementById("error-email").textContent = ""
    const successfulMessage = document.getElementById("contact-success")
    successfulMessage.textContent = "Your enquiry has been saved. Thank you!"

    setTimeout(() => {
        successfulMessage.remove()
    }, 3000)

    let valid = true

    if (firstName === "") {
        document.getElementById("error-first-name").textContent = "Please enter your first name."
        valid = false
    }

    if (lastName === "") {
        document.getElementById("error-last-name").textContent = "Please enter your last name."
        valid = false
    }

    if (email === "") {
        document.getElementById("error-email").textContent = "Please enter your email."
        valid = false 
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("error-email").textContent = "Please enter a valid email.";
        valid = false;
    }

    if (message.length < 10) {
        document.getElementById("error-message").textContent = "The message must be at least 10 characters."
        valid = false
    }

    if (!valid) {
        return
    }

    const enquiries = loadEnquiries()
    enquiries.push({
        id: Date.now(),
        firstName,
        lastName,
        email,
        message,
        date: new Date().toISOString()
    })

    localStorage.setItem("contactEnquiries", JSON.stringify(enquiries))

    contactForm.reset()
    document.getElementById("contact-success").hidden = false
})