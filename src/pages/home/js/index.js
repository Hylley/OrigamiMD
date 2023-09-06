document.getElementById('test').addEventListener('click', () => {
	window.electronAPI.openReader('sou lindo');
});

document.getElementById('import').addEventListener('click', () => {
	window.electronAPI.openImportWindow();
});