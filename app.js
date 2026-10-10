const statuses = ["Applied", "Interview", "Offer", "Rejected"]

const applications = []
const currentFilter = "All"
const searchTerm = ""


const search = document.getElementById("search")
const container = document.getElementById("applications")
const filterStatus = document.getElementById("filter-status")

function createApplicationCard({application, onStatusChange, onDelete}) {
    // card and badge after
    const card = document.createElement("div")
    card.className = "card"

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
        // review this line right here
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

    card.append(title)
    card.append(details)
    card.append(notes)
    card.append(select)
    card.append(deleteBtn)

    return card
}

function handleStatusChange(id, newStatus) {
    const app = applications.find((application) => {
        application.id === id
    })

    if (!app) {
        return
    }

    app.status = newStatus;

    renderApps()
}

function handleDelete(id) {
    applications = applications.filter((application) => {
        application.id !== id
    })

    renderApps()
}

function updateDashboard() {
    const count = (status) => {
        applications.filter((application) => {
            application.status === status
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