const jobsForm = document.getElementById("jobs-form")
const jobsSearch = document.getElementById("jobs-search")
const jobsStatus = document.getElementById("jobs-status")
const jobsResults = document.getElementById("jobs-results")

async function fetchJobs(term) {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(term)}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.jobs
}

function createJobsItem({ job, onTrack}) {
    const item = document.createElement("li")

    const info = document.createElement("div")
    info.className = "job-info"

    const link = document.createElement("a")
    link.href = job.url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.textContent = job.title

    const meta = document.createElement("span")
    meta.textContent = ` ${job.company_name} · ${job.candidate_required_location}`

    info.append(link, meta)
 
    const trackBtn = document.createElement("button")
    trackBtn.textContent = "Add to the Job tracker"
    trackBtn.addEventListener("click", () => {
        onTrack(job)
        trackBtn.textContent = "Added"
        trackBtn.disabled = true
    })

    item.append(info)
    item.append(trackBtn)
    
    return item
}

function trackJob(job) {
    applications.push({
        id: Date.now(),
        company: job.company_name,
        position: job.title,
        status: "Applied",
        notes: job.url,
        dateApplied: new Date().toISOString().slice(0, 10)
    })

    saveApplications(applications)
    renderApps()
}

jobsForm.addEventListener("submit", async (e) => {
    e.preventDefault()
 
    const term = jobsSearch.value.trim()
    jobsStatus.classList.remove("error")
    jobsResults.innerHTML = ""
 
    if (term === "") {
        jobsStatus.textContent = "Type a keyword first."
        return
    }
 
    jobsStatus.textContent = "Loading…"
 
    try {
        const jobs = await fetchJobs(term)
 
        if (jobs.length === 0) {
            jobsStatus.textContent = "No jobs found. Try a different keyword."
            return
        }
 
        jobsStatus.textContent = `${jobs.length} jobs found`
        jobs.forEach((job) => {
            jobsResults.append(createJobsItem({ job, onTrack: trackJob }))
        })
    } catch (error) {
        console.error(error)
        jobsStatus.classList.add("error")
        jobsStatus.textContent = "Could not load jobs. Check your connection and try again."
    }
})