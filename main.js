const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')

let window;

function departure()
{
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
			preload: path.join(__dirname, 'preload.js')
		}
	});

	window.removeMenu();
	window.loadFile('src/home/index.html');

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
				preload: path.join(__dirname, 'rend-preload.js'),
				additionalArguments : [book_id]
			}
		});

		reader.loadFile(`src/reader/index.html`);
		reader.once('ready-to-show', () => {
			reader.maximize();
			reader.show();
		});
	})
	
}
app.on('ready', departure);

// Function to create child window of parent one
function createReaderWindow(id) {
	childWindow = new BrowserWindow({
		modal: true,
		show: false,
		//parent: window,

		// Make sure to add webPreferences with below configuration
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});
	
	// Child window loads settings.html file
	childWindow.loadFile(`src/reader/index.html?id=${id}`);
	
	childWindow.once("ready-to-show", () => {
		childWindow.show();
		childWindow.maximize();
	});
}

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