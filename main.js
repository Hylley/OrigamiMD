const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const database = require('./database.js');
const shelf = require('./shelf.js')
const path = require('path');

shelf.get_shelf((books) => {
	for(book_info of books)
	{
		const book = shelf.get_book(book_info.path);
		book.header((result) => {
			console.log(result);
		})
	}
})

/* -------------------- ELECTRON ------- */
let window;

app.on('ready', () => {
	window = new BrowserWindow({
		width: 1100,
		minWidth: 600,
		height: 600,
		minHeight: 600,
		backgroundColor: '#040D12',
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: 'rgba(0,0,0,0)',
			symbolColor: '#93B1A6',
			height: 30
		},
		webPreferences : {
			preload: path.join(__dirname, '/src/pages/home/js/preload.js')
		}
	});

	window.removeMenu();
	window.loadFile('src/pages/home/index.html');
});

ipcMain.on('open-reader', (event, book_id) => {
	const reader = new BrowserWindow({
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: 'rgba(0,0,0,0)',
			symbolColor: '#93B1A6',
			height: 30
		},
		// parent: window,
		webPreferences : {
			preload: path.join(__dirname, '/src/pages/reader/js/preload.js'),
			additionalArguments : [book_id]
		}
	});

	reader.loadFile(`src/pages/reader/index.html`);
	reader.once('ready-to-show', () => {
		reader.maximize();
		reader.show();
	});
});

ipcMain.on('open-import', (event) => {
	const import_window = new BrowserWindow({
		width: 800,
		height: 500,
		resizable:   false,
		minimizable: false,
		maximizable: false,
		parent: window,
		autoHideMenuBar: true,
		modal: true,
		webPreferences : {
			sandbox: false,
			nodeIntegration: true,
			preload: path.join(__dirname, '/src/pages/import/js/preload.js')
		}
	});

	import_window.loadFile(`src/pages/import/index.html`);
	import_window.once('ready-to-show', () => {
		import_window.show();
	});

	let file_drop_dialog_already_opened = false; // Prevent multiple fires of the event, in case of missclick.
	ipcMain.on('open-file-drop-window-dialog', (event) => {
		dialog.showOpenDialog(
			import_window,
			{
				title : 'Select a file...',
				properties: ['openFile'],
				filters: [
					{ name: 'Supported files', extensions: ['epub', 'ori', 'txt', 'pdf'] }
				]
			}
		).then(result => import_window.webContents.send('chooseFilePath', result));
	});

	ipcMain.on('close-import', (event) => {
		import_window.close();
	})
});

/* -------------------- OTHERS --------- */

// On Windows and Linux, exiting all windows generally quits an
// application entirely.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
});

// However, macOS apps generally continue running even without any
// windows open, and activating the app when no windows are available
// should open a new one.
app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) departure()
});