const { app, BrowserWindow } = require('electron');
const path = require('path')

const ASSETS_PATH = app.isPackaged ?
	path.join(process.resourcesPath, 'assets') :
	path.join(app.getAppPath(), `public${path.sep}assets`);


function departure()
{
	const windown = new BrowserWindow({
		width: 800,
		height: 600,
		preload: path.join(__dirname, 'preload.js'),
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#040D12',
			symbolColor: '#93B1A6',
			height: 30
		}		
	});

	windown.removeMenu();
	windown.loadFile('src/home/index.html');
}

app.on('ready', departure);

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