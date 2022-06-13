// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let MainWindow = null
let OpenWindows = []

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  MainWindow = mainWindow

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:8080/')
  OpenWindows['main-window'] = MainWindow

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//ipc
ipcMain.on('create-new-window', (event, arg) => {
  createNewWindow(arg);
})

ipcMain.on('close-window', (event, args) => {
  const chatId = args.chatId
  OpenWindows[chatId].close()
})

const createNewWindow = (args) => {
  const sidebarSize = 335
  const appHeaderSize = 44
  const position = MainWindow.getPosition()
  const size = MainWindow.getSize()
  const offset = 12

  // Create the browser window.
  const win = new BrowserWindow({
    width: size[0] - sidebarSize,
    height: size[1] - appHeaderSize,
    x: position[0] + sidebarSize + offset,
    y: position[1] + appHeaderSize + offset,
    frame: false,
    autoHideMenuBar: true,
    parent: MainWindow,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  // and load the index.html of the app.
  win.loadURL(`http://localhost:8080/${args.chatId}/${args.threadId || ''}?popout=true`)
  OpenWindows[args.chatId] = win

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}