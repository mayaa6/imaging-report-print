// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {
    ipcRenderer
} = require('electron')

const printPDFBtn = document.getElementById('PDFBtn')

const formValidate = () => {
    let is_validated = true
    document.querySelectorAll("input[required], select[required], textarea[required]").forEach((node) => {
        console.log(node.name)
        console.log(node.value)
        console.log(node.value.length)
        if (node.value.length === 0) {
            is_validated = false
        }
    })
    return is_validated
}

printPDFBtn.addEventListener('click', function (event) {
    const now =  new Date()
    const current_date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    document.getElementById("dateInput").value = current_date
    document.getElementById("reportTimeInput").value = current_date + " " + now.getHours() + ":" + now.getMinutes()
    
    const is_form_validated = formValidate()
    console.log(is_form_validated)
    if (is_form_validated) {
        const file_name = "[" + document.getElementById("dateInput").value + "]" + document.getElementById("nameInput").value
        ipcRenderer.send('print-to-pdf', file_name)
    } else {
        ipcRenderer.send('form-unfinished')
    }

})

ipcRenderer.on('wrote-pdf', function (event, path) {
    // reportForm.reset()
})

const reportForm = document.getElementById("reportForm")

const resetButton = document.getElementById("resetBtn")

resetButton.addEventListener('click', function (event) {
    ipcRenderer.send('confirm-form-reset')
})

ipcRenderer.on('form-reset-result', (event, result) => {
    if (result.response === 0) {
        reportForm.reset()
    }
    return
})