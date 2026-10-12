const contactForm = document.getElementById("contact-form")
const successMessage = document.getElementById("contact-success")

let timer = null

function loadEnquiries() {
    try {
        const data = JSON.parse(localStorage.getItem("contactEnquiries"))
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

function hidePopup() {
    clearTimeout(timer)
    successMessage.hidden = true
}

function showPopup() {
    hidePopup()
    successMessage.hidden = false
    timer = setTimeout(() => {
        successMessage.hidden = true
    }, 5000)
}

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
    showPopup()
})