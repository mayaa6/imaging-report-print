// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {
    ipcRenderer
} = require('electron')

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

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
        const file_name = "[" + document.getElementById("dateInput").value + "]" + document.getElementById("nameInput").value.trim()
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

const jpgBtn1 = document.getElementById("jpgFile1")
const jpgPreview1 = document.getElementById("imageJPG1")
const jpgRemove1 = document.getElementById("imageRemoveBtn1")

jpgBtn1.onchange = function () {
    const reader = new FileReader();

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        jpgPreview1.style.backgroundImage  = "url("+e.target.result+")";
        jpgPreview1.classList.add("has-image");
    };

    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
};

jpgRemove1.onclick = function(e) {
    e.preventDefault();
    jpgPreview1.style.backgroundImage = "none";
    jpgPreview1.classList.remove("has-image");
}

const jpgBtn2 = document.getElementById("jpgFile2")
const jpgPreview2 = document.getElementById("imageJPG2")
const jpgRemove2 = document.getElementById("imageRemoveBtn2")

jpgBtn2.onchange = function () {
    const reader = new FileReader();

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        jpgPreview2.style.backgroundImage  = "url("+e.target.result+")";
        jpgPreview2.classList.add("has-image");
    };

    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
};

jpgRemove2.onclick = function(e) {
    e.preventDefault();
    jpgPreview2.style.backgroundImage = "none";
    jpgPreview2.classList.remove("has-image");
}