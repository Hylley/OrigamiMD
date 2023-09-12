document.getElementById('drop_here').addEventListener('click', () => window.electronAPI.openDialogWindow('showOpenDialog', { title: 'Select a file' }) );

// Both files dropped or opened by dialog window will reach here.
function loadBook(file_path)
{
	if(!['epub', 'ori', 'txt', 'pdf'].includes(getExtension(file_path))) return;
	document.getElementById('search_results').innerHTML = file_path;
}

/* --------------------FILE DROP IMPLEMENTATION -------------------------- */

const drop_here = document.getElementById('drop_here');

drop_here.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();
	drop_here.classList.remove('file_in_drop_space');

	loadBook(event.dataTransfer.files[0].path);
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

function getExtension(filename)
{
	let a = filename.split(".");
	if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
		return "c";
	}

	return a.pop();
}

/* --------------------FILE EXPLORER DIALOG IMPLEMENTATION -------------------------- */

window.electronAPI.chooseFilePath((result) =>  {
	if(result.canceled) return;
	loadBook(result.filePaths[0]);
});