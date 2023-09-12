const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	openDialogWindow: () => ipcRenderer.send('open-file-drop-window-dialog'),
	chooseFilePath: (callback) => {
		ipcRenderer.on('chooseFilePath', (event, result) => {
			callback(result);
		})
	}
})