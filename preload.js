const { ipcRenderer, contextBridge } = require('electron');
// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
contextBridge.exposeInMainWorld('api', {
  openWindow: (args) => ipcRenderer.send('create-new-window', args),
  closeWindow: (args) => ipcRenderer.send('close-window', args)
});