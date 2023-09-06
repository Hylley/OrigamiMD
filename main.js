const { app, BrowserWindow, ipcMain } = require('electron');
const database = require('./database.js');
const path = require('path');

/* -------------------- DATABASE ------- */
database.checkAvaliability();

/* -------------------- ELECTRON ------- */
let window;

app.on('ready', () => {
	window = new BrowserWindow({
		width: 1100,
		height: 600,
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