// Modules to control application life and create native browser window
const fs = require('fs')
const os = require('os')
const path = require('path')
const {app, BrowserWindow, ipcMain, shell, dialog} = require('electron')

let rootWindow

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    title: "影像学报告系统",
    icon: "icon/logo.ico",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  rootWindow = createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('print-to-pdf', function (event, file_name) {
  const win = BrowserWindow.fromWebContents(event.sender)
  
  const defaultPath = 'C:\\Users\\lenovo\Desktop\\' + file_name
  const dialogOptions = {
    title: '保存PDF',
    defaultPath: defaultPath,
    filters: [
      { name: 'PDF', extensions: ['pdf'] }
    ]
  }
  dialog.showSaveDialog(rootWindow, dialogOptions).then(
    (filename) => {
      const pdfPath = filename.filePath
      if (pdfPath.length>0) {
        win.webContents.printToPDF({}).then(
          data => {
            fs.writeFile(pdfPath, data, (error) => {
              if (error) throw error
              shell.openExternal('file://' + pdfPath)
              event.sender.send('wrote-pdf', pdfPath)
            })
            }).catch(error=>{console.error(error)})
      }
    }
  ).catch(error=>{console.error(error)})
})

ipcMain.on('form-unfinished', (event) => {
  dialog.showErrorBox("错误", "报告单没有填写完整！")
})

ipcMain.on('confirm-form-reset', (event) => {
  const options = {
    type: 'warning',
    title: '警告',
    message: "是否清除所有信息？",
    defaultId: 0,
    buttons: ['Yes', 'No']
  }
  dialog.showMessageBox(rootWindow, options).then(
    (result) => {
      event.sender.send('form-reset-result', result)
    }
  ) 
})