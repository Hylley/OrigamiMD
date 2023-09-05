const { app, BrowserWindow } = require('electron');
const path = require('path')

function departure()
{
	const windown = new BrowserWindow({
		width: 800,
		height: 600,
		preload: path.join(__dirname, 'preload.js')
	});

	windown.loadFile('src/index.html');
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