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

printPDFBtn.addEventListener('click', function (event) {
    ipcRenderer.send('print-to-pdf')
})

ipcRenderer.on('wrote-pdf', function (event, path) {
    const message = ` PDF saved to ${path}`
    document.getElementById('pdf-path').innerHTML = message
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