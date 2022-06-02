const { ipcRenderer, contextBridge } = require('electron');
// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
contextBridge.exposeInMainWorld('api', {
  openWindow: (args) => ipcRenderer.send('create-new-window', args)
});