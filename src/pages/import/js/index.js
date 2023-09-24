const drop_here = document.getElementById('drop_here');
const file_info = document.getElementById('info');
const import_button = document.getElementById('file_import');

// Both files dropped or opened by dialog window will reach here.
function loadBook(file)
{
	if(!['epub', 'ori', 'txt', 'pdf'].includes(file.extension)) return;
	
	drop_here.classList.add('hide');
	file_info.classList.remove('hide');
	document.getElementById('file_name').textContent = file.path;
	document.getElementById('file_icon').src = `../../../res/icons/${file.extension}.png`;
	document.getElementById('file_size_value').textContent = `${(file.size / 1024).toFixed(2)} KB`;
	
	import_button.classList.remove('hide');
	import_button.addEventListener('click', () => { window.electronAPI.import_book(file); import_button.classList.add('hide'); })
}

/* --------------------FILE DROP IMPLEMENTATION -------------------------- */
drop_here.addEventListener('click', () => {
	window.electronAPI.openDialogWindow();
});

drop_here.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();
	drop_here.classList.remove('file_in_drop_space');

	loadBook(window.electronAPI.getFileData(event.dataTransfer.files[0].path));
});
 
drop_here.addEventListener('dragover', (e) => {
	e.preventDefault();
	e.stopPropagation();
});

drop_here.addEventListener('dragenter', (event) => {
	drop_here.classList.add('file_in_drop_space');
});
 
drop_here.addEventListener('dragleave', (event) => {
	drop_here.classList.remove('file_in_drop_space');
});

/* --------------------FILE EXPLORER DIALOG IMPLEMENTATION -------------------------- */

window.electronAPI.chooseFilePath((result) =>  {
	if(result.canceled) return;
	loadBook(window.electronAPI.getFileData(result.filePaths[0]));
});