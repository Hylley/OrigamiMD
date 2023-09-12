document.getElementById('drop_here').addEventListener('click', () => window.electronAPI.openDialogWindow('showOpenDialog', { title: 'Select a file' }) );

// Both files dropped or opened by dialog window will reach here.
function loadBook(file_path)
{
	document.getElementById('search_results').innerHTML = file_path;
}

window.electronAPI.chooseFilePath((result) =>  {
	if(result.canceled) return;
	loadBook(result.filePaths);
});