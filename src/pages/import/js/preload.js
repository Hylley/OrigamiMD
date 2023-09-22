const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

function getExtension(filename)
{
	let a = filename.split(".");
	if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
		return "c";
	}

	return a.pop();
}

function getFileData(path)
{
	file_stats = fs.statSync(path);

	return {
		path : path,
		extension : file_stats.isFile() ? getExtension(path) : '.',
		size : file_stats.size
	}
}

contextBridge.exposeInMainWorld('electronAPI', {
	openDialogWindow: () => ipcRenderer.send('open-file-drop-window-dialog'),
	chooseFilePath: (callback) => {
		ipcRenderer.on('chooseFilePath', (event, result) => {
			callback(result);
		})
	},
	getFileData: getFileData
})