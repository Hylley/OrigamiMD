document.getElementById('drop_here').addEventListener('click', () => window.electronAPI.openDialogWindow('showOpenDialog', { title: 'Select a file' }) );

const drop_here = document.getElementById('drop_here');
const file_info = document.getElementById('info')

// Both files dropped or opened by dialog window will reach here.
function loadBook(file_path)
{
	const file_extension = getExtension(file_path);
	if(!['epub', 'ori', 'txt', 'pdf'].includes(file_extension)) return;
	
	drop_here.classList.add('hide');
	file_info.classList.remove('hide');
	document.getElementById('file_name').textContent = file_path;
	document.getElementById('file_icon').src = `../../../res/icons/${file_extension}.png`;
	document.getElementById('file_import').classList.remove('hide');

	fs.stat(path, (err, stats) => {
		if(err)
		{
			console.log(err);
			return;
		}
		
		document.getElementById('file_size_value').textContent = `${stats.size / 2048} MB`;
	})
}

/* --------------------FILE DROP IMPLEMENTATION -------------------------- */


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