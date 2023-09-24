document.getElementById('import').addEventListener('click', () => {
	window.electronAPI.openImportWindow();
});

/*
	Output must be:

<button class="book">
	<div class="cover">
		<img class="cover_img" src="../../../res/tmp/cover.png"/>
		<!-- <input type="range" min="0" max="100" value="50" class="cover_slider" disabled /> -->
	</div>
	<h2 class="book_title">O Diário de Anne Frank</h2>
	<h3 class="book_author">Anne Frank</h2>
</button>
*/
window.electronAPI.sendShelfData((event, shelf) =>
{
	for(book of shelf)
	{
		const book_element = document.createElement('button');
		book_element.classList.add('book');

		const b64 = book.cover_buffer.toString('base64');

		book_element.innerHTML = `
			<div class="cover">
				<img class="cover_img" src="data:image/png;base64,${b64}"/>
			</div>
			<h2 class="book_title">${book.title}</h2>
			<h3 class="book_author">${book.authors.join(', ')}</h3>
		`
		book_element.addEventListener('click', () => window.electronAPI.openReader(book.id.toString()) );
		

		document.getElementById('library').appendChild(book_element);
	}
})