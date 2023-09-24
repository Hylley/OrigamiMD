const { dialog, contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const database = require('../../../../database');

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
		size : file_stats.size,
		seed : ''
	}
}

function import_book(file)
{
	db = database.get_db();
	db.run(`
		INSERT INTO bookshelf (path, seed, scroll_path, scroll_value, progress) VALUES (
			?,
			?,
			'./',
			0,
			0
		);
	`, [file.path, file.seed],
	(error) => {
		document.write(error);
		db.close();
		ipcRenderer.send('close-import');
	});
}

contextBridge.exposeInMainWorld('electronAPI', {
	openDialogWindow: () => ipcRenderer.send('open-file-drop-window-dialog'),
	chooseFilePath: (callback) => {
		ipcRenderer.on('chooseFilePath', (event, result) => {
			callback(result);
		})
	},
	getFileData: getFileData,
	import_book : import_book
})