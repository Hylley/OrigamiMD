const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openReader: (book_id) => ipcRenderer.send('open-reader', book_id),
  openImportWindow: () => ipcRenderer.send('open-import')
})